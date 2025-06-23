'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBucket, getAllBuckets, Bucket } from '../../../src/services/bucketService';

export default function BucketsPage() {
  const router = useRouter();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketDescription, setNewBucketDescription] = useState('');
  const [isAddingBucket, setIsAddingBucket] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const fetchBuckets = async () => {
      try {
        const data = await getAllBuckets();
        setBuckets(data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, [router]);

  const handleAddBucket = async () => {
    if (!newBucketName.trim()) return;

    setIsAddingBucket(true);
    try {
      const newBucket = await createBucket({
        BucketName: newBucketName,
        BucketDescription: newBucketDescription,
      });
      setBuckets([...buckets, newBucket]);
      setNewBucketName('');
      setNewBucketDescription('');
    } catch (error) {
      console.error('Error creating bucket:', error);
    } finally {
      setIsAddingBucket(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Buckets</h1>
            <button
              onClick={() => setIsAddingBucket(!isAddingBucket)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isAddingBucket ? 'Cancel Add' : 'Add New Bucket'}
            </button>
          </div>

          {isAddingBucket && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Add New Bucket</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="bucketName" className="block text-sm font-medium text-gray-700">Bucket Name</label>
                  <input
                    type="text"
                    id="bucketName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newBucketName}
                    onChange={(e) => setNewBucketName(e.target.value)}
                    placeholder="Enter bucket name"
                  />
                </div>
                <div>
                  <label htmlFor="bucketDescription" className="block text-sm font-medium text-gray-700">Bucket Description</label>
                  <textarea
                    id="bucketDescription"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newBucketDescription}
                    onChange={(e) => setNewBucketDescription(e.target.value)}
                    placeholder="Enter bucket description"
                  ></textarea>
                </div>
                <button
                  onClick={handleAddBucket}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Create Bucket
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Loading buckets...</div>
          ) : buckets.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No buckets found</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {buckets.map((bucket) => (
                <div
                  key={bucket.BucketId}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/buckets/${bucket.BucketId}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bucket.BucketName}</h3>
                      <p className="text-gray-600 mt-1">{bucket.BucketDescription}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tasks/add?bucketId=${bucket.BucketId}`);
                        }}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
                      >
                        Add Task
                      </button>
                    </div>
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