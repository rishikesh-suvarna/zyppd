'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The sign in link is no longer valid. It may have been used already or it may have expired.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    }
  };

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
            variants={iconVariants}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AlertCircle size={32} className="text-white" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400 opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-white mb-2"
            variants={itemVariants}
          >
            Authentication Error
          </motion.h2>

          <motion.p
            className="text-gray-300 mb-8"
            variants={itemVariants}
          >
            {getErrorMessage(error)}
          </motion.p>

          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/auth/signin"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
              >
                <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-600 rounded-lg shadow-lg text-sm font-medium text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 group"
              >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Additional help section */}
        <motion.div
          className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-800"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            Need Help?
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              • Try refreshing the page and signing in again
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              • Clear your browser cache and cookies
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              • Contact support if the problem persists
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}