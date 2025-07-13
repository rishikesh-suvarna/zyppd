/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Github, Mail, Link2, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAnalytics } from '@/components/AnalyticsProvider';

function SignInContent() {
  const [providers, setProviders] = useState<Record<string, import('next-auth/react').ClientSafeProvider> | null>(null);
  const [loading, setLoading] = useState(false);
  const { trackUserSignin } = useAnalytics();

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      console.log(res)
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setLoading(true);
    try {
      trackUserSignin(providerId);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  const features = [
    'Custom short links with analytics',
    'Password protection & expiration',
    'Custom domains (Premium)',
    'Detailed click tracking',
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Sign in form */}
          <motion.div
            className="max-w-md mx-auto lg:mx-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center lg:text-left mb-8" variants={itemVariants}>
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Link2 size={24} className="text-black" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Sign in / up to your account
              </h1>
              <p className="text-gray-400">
                Access your dashboard and manage your links
              </p>
            </motion.div>

            {error && (
              <motion.div
                className="border border-gray-700 rounded-lg p-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                variants={itemVariants}
              >
                <div className="text-gray-300 text-sm">
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

            <motion.div className="space-y-3" variants={itemVariants}>
              {providers && Object.values(providers).map((provider: any) => (
                <motion.button
                  key={provider.name}
                  onClick={() => handleSignIn(provider.id)}
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${provider.id === 'github'
                    ? 'bg-white text-black hover:bg-gray-100 border border-gray-200'
                    : 'border border-gray-700 text-white hover:border-gray-600 hover:bg-gray-900'
                    }`}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                >
                  {getProviderIcon(provider.id)}
                  <span className="ml-3 flex-1 text-left">
                    {loading ? 'Signing in...' : `Continue with ${provider.name}`}
                  </span>
                  <ArrowRight size={16} className="opacity-50" />
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              className="mt-6 text-center text-sm text-gray-500"
              variants={itemVariants}
            >
              By signing in / up, you agree to our <Link className='text-gray-200' href="/terms-of-service">Terms of Service</Link> and <Link className='text-gray-200' href="/privacy-policy">Privacy Policy</Link>
            </motion.div>
          </motion.div>

          {/* Right side - Features */}
          <motion.div
            className="lg:pl-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-white mb-3">
                Why sign up?
              </h2>
              <p className="text-gray-400 mb-8">
                Unlock advanced features and take control of your links
              </p>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                >
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle size={14} className="text-black" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 p-6 border border-gray-800 rounded-lg"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Free Forever
              </h3>
              <p className="text-gray-400 text-sm">
                Start with our free plan and upgrade when you need more features.
                No hidden costs, no commitments.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}