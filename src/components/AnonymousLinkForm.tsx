/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Link as LinkIcon, FileText, Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface AnonymousLinkFormProps {
  onLinkCreated?: (link: any) => void;
}

export function AnonymousLinkForm({ onLinkCreated }: AnonymousLinkFormProps) {
  const [formData, setFormData] = useState({
    originalUrl: '',
    shortCode: '',
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLink, setCreatedLink] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCreatedLink(null);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: formData.originalUrl,
          shortCode: formData.shortCode || undefined,
          title: formData.title || undefined,
          description: formData.description || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const newLink = await response.json();
      setCreatedLink(newLink);
      onLinkCreated?.(newLink);

      // Reset form
      setFormData({
        originalUrl: '',
        shortCode: '',
        title: '',
        description: '',
      });
    } catch (err) {
      console.error('Create link error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (createdLink?.shortUrl) {
      try {
        await navigator.clipboard.writeText(createdLink.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center">
            <LinkIcon size={28} className="mr-3 text-white" />
            Create Short Link
          </h2>
          <p className="text-gray-300">
            Transform your long URL into a short, shareable link instantly
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!createdLink ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <LinkIcon size={16} className="mr-2 text-white" />
                  Original URL *
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={formData.originalUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                  className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all text-lg"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Custom Short Code (optional)
                </label>
                <input
                  type="text"
                  placeholder="my-custom-link"
                  value={formData.shortCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortCode: e.target.value }))}
                  className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Leave empty to generate automatically
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={itemVariants}
              >
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <FileText size={16} className="mr-2 text-white" />
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="My Link"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div
                  className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  variants={itemVariants}
                >
                  <div className="flex items-center text-red-200 text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                variants={itemVariants}
              >
                {loading ? (
                  <motion.div className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    Creating Your Link...
                  </motion.div>
                ) : (
                  'Create Short Link'
                )}
              </motion.button>

              <motion.div
                className="text-center text-sm text-gray-400"
                variants={itemVariants}
              >
                Want more features like password protection and analytics?{' '}
                <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign up for free
                </Link>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center border border-green-700/50">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  Link Created Successfully!
                </h3>
                <p className="text-gray-300 mb-6">
                  Your short link is ready to share
                </p>
              </motion.div>

              <motion.div
                className="bg-black/50 border border-gray-600 rounded-xl p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Your short link:</span>
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-1" />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <span className="text-white font-mono text-lg break-all">
                    {createdLink.shortUrl}
                  </span>
                </div>

                <motion.a
                  href={createdLink.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <ExternalLink size={16} className="mr-1" />
                  Test your link
                </motion.a>
              </motion.div>

              <motion.button
                onClick={() => {
                  setCreatedLink(null);
                  setError('');
                }}
                className="bg-gray-700 text-gray-200 px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Create Another Link
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}