'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToDo, getToDoById, updateToDo } from '@/services/todoService';
import { Bucket, getAllBuckets } from '@/services/bucketService';
import { getAllUsers } from '@/services/userService';
import { User } from '@/types/user';
import axios from 'axios';

interface EditTaskPageProps {
  params: { id: string };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<ToDo>>({
    Title: '',
    Description: '',
    BucketID: undefined,
    AssignTo: undefined,
    DueDateTime: undefined,
    Priority: 'medium',
  });
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchTaskAndRelatedData = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const [taskData, bucketsData, usersData] = await Promise.all([
          getToDoById(Number(id)),
          getAllBuckets(),
          getAllUsers(),
        ]);

        setFormData({
          Title: taskData.Title || '',
          Description: taskData.Description || '',
          BucketID: taskData.BucketID,
          AssignTo: taskData.AssignTo,
          DueDateTime: taskData.DueDateTime
            ? new Date(taskData.DueDateTime)
            : undefined,
          Priority: taskData.Priority || 'medium',
        });
        setBuckets(bucketsData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load task for editing.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTaskAndRelatedData();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      let filePath: string | undefined = formData.FilePath;
      if (file) {
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        const uploadRes = await axios.post('http://localhost:5000/todos/upload', formDataFile, {
          headers: {
            Authorization: `Bearer ${JSON.parse(accessToken)}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        filePath = uploadRes.data.filePath;
      }

      const payload: Partial<ToDo> = {
        Title: formData.Title,
        Description: formData.Description,
        BucketID:
          formData.BucketID !== undefined && String(formData.BucketID) !== ''
            ? Number(formData.BucketID)
            : undefined,
        AssignTo:
          formData.AssignTo !== undefined && String(formData.AssignTo) !== ''
            ? Number(formData.AssignTo)
            : undefined,
        DueDateTime: formData.DueDateTime
          ? new Date(formData.DueDateTime).toISOString()
          : undefined,
        Priority: formData.Priority
          ? formData.Priority.charAt(0).toUpperCase()
          : undefined,
        FilePath: filePath,
      };

      // Remove undefined properties from the payload
      Object.keys(payload).forEach(
        (key) =>
          payload[key as keyof ToDo] === undefined &&
          delete payload[key as keyof ToDo],
      );

      console.log('Update payload:', payload);
      await updateToDo(Number(id), payload);

      router.push('/tasks');
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center py-4">
          Loading task...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center py-4 text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Task</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Task Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.Title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, Title: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.Description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="assignTo"
                className="block text-sm font-medium text-gray-700"
              >
                Assign To
              </label>
              <select
                id="assignTo"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={String(formData.AssignTo ?? '')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    AssignTo: e.target.value !== '' ? Number(e.target.value) : undefined,
                  })
                }
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
              <label
                htmlFor="bucketId"
                className="block text-sm font-medium text-gray-700"
              >
                Bucket
              </label>
              <select
                id="bucketId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={String(formData.BucketID ?? '')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    BucketID: e.target.value !== '' ? Number(e.target.value) : undefined,
                  })
                }
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
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={
                  formData.DueDateTime
                    ? new Date(formData.DueDateTime).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    DueDateTime: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </label>
              <select
                id="priority"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.Priority || 'medium'}
                onChange={(e) =>
                  setFormData({ ...formData, Priority: e.target.value })
                }
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
                {loading ? 'Updating...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 