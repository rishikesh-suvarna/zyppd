
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PasswordFormProps {
  shortCode: string;
  error?: string;
}

export function PasswordForm({ shortCode, error }: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Redirect with password in query params
    const url = `/${shortCode}?password=${encodeURIComponent(password)}`;
    router.push(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Protected Link</h2>
          <p className="text-gray-600 mb-6">This link is password protected. Please enter the password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Access Link'}
          </button>
        </form>
      </div>
    </div>
  );
}