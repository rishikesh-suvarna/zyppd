'use client';

import Link from 'next/link';
import { Home, Search, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  } as const;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="max-w-md w-full text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <motion.div
            className="flex justify-center mb-6"
            variants={iconVariants}
          >
            <motion.div
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search size={40} className="text-black" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400 opacity-50"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-white mb-4"
            variants={itemVariants}
          >
            404 - Link Not Found
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-8"
            variants={itemVariants}
          >
            This link doesn&apos;t exist or has been deactivated.
          </motion.p>
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
            >
              <Home size={16} className="mr-2 group-hover:-translate-y-0.5 transition-transform duration-200" />
              Go to Homepage
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-600 rounded-lg shadow-lg text-sm font-medium text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 group"
            >
              <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
              Try Again
            </button>
          </motion.div>
        </motion.div>

        {/* Additional help section */}
        <motion.div
          className="mt-12 bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700"
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
            What happened?
          </h3>
          <div className="space-y-2 text-sm text-gray-300 text-left">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              • The link may have been typed incorrectly
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              • The link may have been deleted or deactivated
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              • You may not have permission to access this link
            </motion.p>
          </div>
        </motion.div>

        {/* Floating animation elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-orange-500/20 rounded-full"
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
    </div>
  );
}