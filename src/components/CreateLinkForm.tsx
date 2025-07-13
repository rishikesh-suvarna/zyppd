/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Link as LinkIcon, Lock, Calendar, FileText, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CreateLinkFormProps {
  onSubmit: (link: any) => void;
  onCancel: () => void;
}

export function CreateLinkForm({ onSubmit, onCancel }: CreateLinkFormProps) {
  const { status } = useSession();
  const [formData, setFormData] = useState({
    originalUrl: '',
    shortCode: '',
    title: '',
    description: '',
    password: '',
    expiresAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is authenticated
  if (status === 'loading') {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-black rounded-xl shadow-2xl p-8 border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <motion.div
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-black rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-700"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-4">Please sign in to access advanced link features like password protection and analytics.</p>
            <div className="flex space-x-3">
              <Link
                href="/auth/signin"
                className="flex-1 bg-white text-black py-2 px-4 rounded-lg transition-colors text-center"
              >
                Sign In
              </Link>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const isAuthenticated = status === 'authenticated';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestBody: any = {
        originalUrl: formData.originalUrl,
        shortCode: formData.shortCode || undefined,
        title: formData.title || undefined,
        description: formData.description || undefined,
      };

      // Only include premium features for authenticated users
      if (isAuthenticated) {
        if (formData.password) requestBody.password = formData.password;
        if (formData.expiresAt) requestBody.expiresAt = formData.expiresAt;
      }

      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const newLink = await response.json();
      onSubmit(newLink);

      // Reset form
      setFormData({
        originalUrl: '',
        shortCode: '',
        title: '',
        description: '',
        password: '',
        expiresAt: '',
      });
    } catch (err) {
      console.error('Create link error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          className="bg-black rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-6">
            <motion.div
              className="flex justify-between items-center mb-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-white flex items-center">
                <LinkIcon size={20} className="mr-2 text-white" />
                Create New Link
                {isAuthenticated && (
                  <Crown size={16} className="ml-2 text-yellow-400" />
                )}
              </h2>
              <motion.button
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            {!isAuthenticated && (
              <motion.div
                className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6"
                variants={itemVariants}
              >
                <p className="text-blue-200 text-sm">
                  💡 <strong>Note:</strong> You&apos;re creating an anonymous link. Sign up for password protection, expiration dates, and analytics!
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <LinkIcon size={16} className="mr-2 text-white" />
                  Original URL *
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.originalUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Short Code (optional)
                </label>
                <input
                  type="text"
                  placeholder="my-link"
                  value={formData.shortCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortCode: e.target.value }))}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty to generate automatically
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <FileText size={16} className="mr-2 text-white" />
                  Title (optional)
                </label>
                <input
                  type="text"
                  placeholder="My Link"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  placeholder="Brief description of your link"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all resize-none"
                  rows={3}
                />
              </motion.div>

              {/* Premium Features - Only show for authenticated users */}
              {isAuthenticated && (
                <>
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Lock size={16} className="mr-2 text-white" />
                      Password Protection (optional)
                      <Crown size={12} className="ml-1 text-yellow-400" />
                    </label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Calendar size={16} className="mr-2 text-white" />
                      Expiration Date (optional)
                      <Crown size={12} className="ml-1 text-yellow-400" />
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                    />
                  </motion.div>
                </>
              )}

              {error && (
                <motion.div
                  className="bg-red-900/50 border border-red-700 rounded-lg p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-red-200 text-sm">{error}</div>
                </motion.div>
              )}

              <motion.div
                className="flex space-x-3 pt-4"
                variants={itemVariants}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <motion.div className="flex items-center justify-center">
                      <motion.div
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                      Creating...
                    </motion.div>
                  ) : (
                    'Create Link'
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-700 text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}