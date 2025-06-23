'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TeamMember {
  UID: number;
  Fname: string;
  Lname: string;
  Mname: string;
  Email: string;
  UserType: string;
}

export default function TeamMembersPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    
    const fetchTeamMembers = async () => {
      try {
        
        const response = await fetch('http://localhost:5000/user', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
        } else {
          console.error('Failed to fetch team members');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading team members...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.UID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.UID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.Fname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.Lname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.Mname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.Email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.UserType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 