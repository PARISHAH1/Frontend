'use client';

import { useEffect, useState } from 'react';
import { userApi, User } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userApi.getAll();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.UID} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">
              {user.Fname} {user.Mname} {user.Lname}
            </h2>
            <p>Email: {user.Email}</p>
            <p>Phone: {user.Phone}</p>
            <p>User Type: {user.UserType}</p>
            <p>Status: {user.StatusType}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 