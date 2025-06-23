'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToDo, getAllToDos, deleteToDo } from '@/services/todoService';
import { Bucket, getAllBuckets } from '@/services/bucketService';

export default function TasksPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasksAndBuckets = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const [todosData, bucketsData] = await Promise.all([
          getAllToDos(),
          getAllBuckets()
        ]);
        setTodos(todosData);
        setBuckets(bucketsData);
      } catch (err) {
        console.error('Error fetching tasks or buckets:', err);
        setError('Failed to load tasks or buckets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndBuckets();
  }, [router]);

  const getBucketName = (bucketId?: number) => {
    if (!bucketId) return 'N/A';
    const bucket = buckets.find(b => b.BucketId === bucketId);
    return bucket ? bucket.BucketName : 'N/A';
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteToDo(id);
        setTodos(todos.filter(todo => todo.ToDoId !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center py-4">Loading tasks...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center py-4 text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <button
              onClick={() => router.push('/tasks/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add New Task
            </button>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No tasks found</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todos.map((todo) => (
                <div
                  key={todo.ToDoId}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{todo.Title}</h3>
                  <p className="text-gray-600 mt-1">{todo.Description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Bucket: {getBucketName(todo.BucketID)}</p>
                    <p>Due Date: {todo.DueDateTime ? new Date(todo.DueDateTime).toLocaleDateString() : 'N/A'}</p>
                    <p>Priority: {todo.Priority}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => router.push(`/tasks/edit/${todo.ToDoId}`)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => todo.ToDoId && handleDelete(todo.ToDoId)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 