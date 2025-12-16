'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun } from 'lucide-react';
import { useStore } from '@/lib/store';
import { User } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [selectedRole, setSelectedRole] = useState<User['role']>('bd_manager');

  const users: User[] = [
    { id: '1', name: 'Parth Bonde', email: 'parth@ecofy.co.in', role: 'bd_manager' },
    { id: '2', name: 'FCU Team', email: 'fcu@ecofy.co.in', role: 'fcu' },
    { id: '3', name: 'Credit Team', email: 'credit@ecofy.co.in', role: 'credit' },
    { id: '4', name: 'Operations Team', email: 'ops@ecofy.co.in', role: 'ops' },
    { id: '5', name: 'App Support Team', email: 'support@ecofy.co.in', role: 'app_support' },
  ];

  const handleLogin = () => {
    const user = users.find(u => u.role === selectedRole);
    if (user) {
      setCurrentUser(user);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ecofy-light via-white to-ecofy-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ecofy-primary rounded-xl mb-4">
            <Sun className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ecofy Solar</h1>
          <p className="text-gray-600">Dealer Onboarding Portal</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as User['role'])}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-ecofy-primary focus:border-transparent"
            >
              {users.map((user) => (
                <option key={user.id} value={user.role}>
                  {user.name} - {user.role.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-ecofy-primary hover:bg-ecofy-secondary text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Login to Dashboard
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-600">
            Secure dealer onboarding automation system with role-based access control
          </p>
        </div>
      </div>
    </div>
  );
}
