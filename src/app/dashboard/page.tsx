'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSessionItem, setSessionItem } from '../../utils/sessionStorage';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'Vraj123';

const validateTokenTime = (encryptedToken: string): { isValid: boolean; timeDiff: number } => {
  try {
    // Decrypt the token
    const decrypted = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      console.error('Failed to decrypt token');
      return { isValid: false, timeDiff: 0 };
    }

    // Split token and timestamp
    const [_, timestamp] = decryptedString.split('_');
    if (!timestamp) {
      console.error('Invalid token format - missing timestamp');
      return { isValid: false, timeDiff: 0 };
    }

    // Check time difference
    const currentTime = Date.now();
    const tokenTime = parseInt(timestamp);
    const timeDiff = currentTime - tokenTime;

    console.log('Token validation:', {
      currentTime,
      tokenTime,
      timeDiff,
      isValid: timeDiff <= 60000 // Must be less than 60 seconds
    });

    return { 
      isValid: timeDiff <= 60000,
      timeDiff: timeDiff
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { isValid: false, timeDiff: 0 };
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [validationStatus, setValidationStatus] = useState<string>('');
  
  useEffect(() => {
    const validateAndRedirect = async () => {
      const accessToken = getSessionItem('accessToken');
      const encryptedToken = getSessionItem('encryptedToken');
      
      console.log('Dashboard - Retrieved tokens:', { accessToken, encryptedToken });
      
      if (!accessToken || !encryptedToken) {
        setValidationStatus('No tokens found');
        console.log('No tokens found, redirecting to login');
        router.push('/login');
        return;
      }

      // Validate token time (must be less than 60 seconds old)
      const { isValid, timeDiff } = validateTokenTime(typeof encryptedToken === 'string' ? encryptedToken : '');
      console.log('Token validation result:', { isValid, timeDiff });

      if (!isValid) {
        setValidationStatus('Token validation window expired');
        console.log('Token validation window expired, redirecting to login');
        setSessionItem('accessToken', null);
        setSessionItem('encryptedToken', null);
        router.push('/login');
        return;
      }

      setValidationStatus('Session active');
      setIsLoading(false);
    };

    validateAndRedirect();
  }, [router]);

  const handleLogout = () => {
    console.log('Logging out, clearing session storage');
    setSessionItem('accessToken', null);
    setSessionItem('encryptedToken', null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to Dashboard
              </h1>
              <div className="mt-2">
                
                 
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/tasks/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Task
            </button>

            <button
              onClick={() => router.push('/tasks')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Tasks
            </button>

            <button
              onClick={() => router.push('/buckets')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Buckets
            </button>

            <button
              onClick={() => router.push('/team-members')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
               Team Members
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 