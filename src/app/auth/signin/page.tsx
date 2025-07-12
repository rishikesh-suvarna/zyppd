/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Github, Mail, Link2 } from 'lucide-react';

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, import('next-auth/react').ClientSafeProvider> | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setLoading(true);
    try {
      await signIn(providerId, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return <Github size={20} />;
      case 'google':
        return <Mail size={20} />;
      default:
        return <Link2 size={20} />;
    }
  };

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return 'bg-gray-900 hover:bg-gray-800 text-white';
      case 'google':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Link2 size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Zyppd
            </h2>
            <p className="text-gray-600">
              Sign in to start shortening your URLs and tracking analytics
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800 text-sm">
                  {error === 'OAuthSignin' && 'Error occurred during sign in. Please try again.'}
                  {error === 'OAuthCallback' && 'Error occurred during authentication. Please try again.'}
                  {error === 'OAuthCreateAccount' && 'Could not create account. Please try again.'}
                  {error === 'EmailCreateAccount' && 'Could not create account. Please try again.'}
                  {error === 'Callback' && 'Error occurred during sign in. Please try again.'}
                  {error === 'OAuthAccountNotLinked' && 'Account not linked. Please use a different sign in method.'}
                  {error === 'EmailSignin' && 'Check your email for the sign in link.'}
                  {error === 'CredentialsSignin' && 'Invalid credentials. Please check your email and password.'}
                  {error === 'SessionRequired' && 'Please sign in to access this page.'}
                  {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'CredentialsSignin', 'SessionRequired'].includes(error) && 'An error occurred. Please try again.'}
                </div>
              </div>
            )}

            {providers && Object.values(providers).map((provider: any) => (
              <button
                key={provider.name}
                onClick={() => handleSignIn(provider.id)}
                disabled={loading}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getProviderColor(provider.id)}`}
              >
                {getProviderIcon(provider.id)}
                <span className="ml-2">
                  {loading ? 'Signing in...' : `Continue with ${provider.name}`}
                </span>
              </button>
            ))}

          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Create custom short links
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Password protect your links
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Track detailed analytics
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Set expiration dates
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Custom domains (Premium)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Suspense>
  );
}