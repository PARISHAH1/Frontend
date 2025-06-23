'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createToDo } from '@/services/todoService';
import { getAllBuckets, Bucket } from '@/services/bucketService';
import { getAllUsers } from '@/services/userService';
import { User } from '@/types/user';
import axios from 'axios';

export default function AddTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bucketId: '',
    assignTo: '',
    dueDate: '',
    priority: 'medium'
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const [bucketsData, usersData] = await Promise.all([
          getAllBuckets(),
          getAllUsers(),
        ]);

        setBuckets(bucketsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      let filePath: string | undefined = undefined;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axios.post('http://localhost:5000/todos/upload', formData, {
          headers: {
            Authorization: `Bearer ${JSON.parse(accessToken)}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        filePath = uploadRes.data.filePath;
      }

      const newTodo = await createToDo({
        Title: formData.title,
        Description: formData.description,
        BucketID: formData.bucketId ? Number(formData.bucketId) : undefined,
        AssignTo: formData.assignTo ? Number(formData.assignTo) : undefined,
        DueDateTime: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : undefined,
        Priority: formData.priority
          ? formData.priority.charAt(0).toUpperCase()
          : undefined,
        FilePath: filePath,
      });

      if (newTodo) {
        router.push('/tasks');
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8" key={users.length}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Task</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700">
                Assign To
              </label>
              <select
                id="assignTo"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.assignTo}
                onChange={(e) => setFormData({ ...formData, assignTo: e.target.value })}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.UID} value={user.UID}>
                    {user.FirstName && user.LastName
                      ? `${user.FirstName} ${user.LastName}`
                      : user.Email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bucketId" className="block text-sm font-medium text-gray-700">
                Bucket
              </label>
              <select
                id="bucketId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.bucketId}
                onChange={(e) => setFormData({ ...formData, bucketId: e.target.value })}
              >
                <option value="">Select a bucket</option>
                {buckets.map((bucket) => (
                  <option key={bucket.BucketId} value={bucket.BucketId}>
                    {bucket.BucketName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Attach File
              </label>
              <input
                type="file"
                id="file"
                className="mt-1 block w-full"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 