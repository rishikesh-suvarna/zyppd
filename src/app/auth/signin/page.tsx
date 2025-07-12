/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Github, Mail, Link2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function SignInContent() {
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
        return 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700';
      case 'google':
        return 'bg-white hover:bg-gray-50 text-gray-900 border-gray-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const features = [
    { text: 'Create custom short links', color: 'bg-blue-500' },
    { text: 'Password protect your links', color: 'bg-green-500' },
    { text: 'Track detailed analytics', color: 'bg-purple-500' },
    { text: 'Set expiration dates', color: 'bg-orange-500' },
    { text: 'Custom domains (Premium)', color: 'bg-pink-500' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Link2 size={32} className="text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to Zyppd
          </h2>
          <p className="text-gray-300">
            Sign in to start shortening your URLs and tracking analytics
          </p>
        </motion.div>

        <motion.div className="mt-8 space-y-4" variants={itemVariants}>
          {error && (
            <motion.div
              className="bg-red-900/50 border border-red-700 rounded-lg p-4 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-red-200 text-sm">
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
            </motion.div>
          )}

          {providers && Object.values(providers).map((provider: any, index: number) => (
            <motion.button
              key={provider.name}
              onClick={() => handleSignIn(provider.id)}
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg shadow-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:shadow-xl group ${getProviderColor(provider.id)}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <motion.div
                className="flex items-center"
                animate={loading ? { x: [0, 5, 0] } : {}}
                transition={{ repeat: loading ? Infinity : 0, duration: 0.5 }}
              >
                {getProviderIcon(provider.id)}
                <span className="ml-2">
                  {loading ? 'Signing in...' : `Continue with ${provider.name}`}
                </span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-800"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            Features
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            {features.map((feature, index) => (
              <motion.li
                key={feature.text}
                className="flex items-center group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className={`w-2 h-2 ${feature.color} rounded-full mr-3`}
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <span className="group-hover:text-white transition-colors">{feature.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}