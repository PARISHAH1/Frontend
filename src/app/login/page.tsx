'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { setSessionItem, getSessionItem } from '../../utils/sessionStorage';

const SECRET_KEY = 'Vraj123';

const createEncryptedToken = (token: string) => {
  const timestamp = Date.now();
  const combinedString = `${token}_${timestamp}`;
  const encrypted = CryptoJS.AES.encrypt(combinedString, SECRET_KEY);
  return encrypted.toString();
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const loginResponse = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('Login response:', loginData); // Debug log
        
        // Create encrypted token with timestamp
        const encryptedToken = createEncryptedToken(loginData.access_token);
        console.log('Encrypted token created:', encryptedToken); // Debug log
        
        // Store both tokens using session storage utilities
        setSessionItem('accessToken', loginData.access_token);
        setSessionItem('encryptedToken', encryptedToken);
        
        // Verify storage
        const storedToken = getSessionItem('accessToken');
        const storedEncryptedToken = getSessionItem('encryptedToken');
        console.log('Stored tokens:', { storedToken, storedEncryptedToken }); // Debug log
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        const errorData = await loginResponse.json();
        setError(errorData.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError('An error occurred while logging in');
      setSessionItem('accessToken', null);
      setSessionItem('encryptedToken', null);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>

          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 