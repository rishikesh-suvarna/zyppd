/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAnalytics } from './AnalyticsProvider';

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
  const { trackLinkCreation, trackEvent } = useAnalytics();


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

      trackLinkCreation({
        hasCustomCode: !!formData.shortCode,
        hasPassword: false,
        hasExpiration: false,
        isAnonymous: true,
      });

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
      trackEvent('link_creation_error', {
        event_category: 'error',
        error_message: err instanceof Error ? err.message : 'Unknown error',
        is_anonymous: true,
      });
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
        trackEvent('link_copied', {
          event_category: 'engagement',
          link_id: createdLink.id,
          is_anonymous: true,
        });
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const itemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
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
            staggerChildren: 0.05
          }
        }
      }}
    >
      <motion.div
        className="border border-gray-800 rounded-lg p-8"
        variants={itemVariants}
      >
        <AnimatePresence mode="wait">
          {!createdLink ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white mb-2">
                  Original URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={formData.originalUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500 transition-colors"
                  required
                />
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Custom Code (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="my-link"
                    value={formData.shortCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortCode: e.target.value }))}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="My Link"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500 transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500 transition-colors"
                />
              </motion.div>

              {error && (
                <motion.div
                  className="border border-gray-700 rounded-lg p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  variants={itemVariants}
                >
                  <div className="flex items-center text-gray-300 text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium hover:bg-gray-100"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                variants={itemVariants}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    Creating...
                  </div>
                ) : (
                  'Create Short Link'
                )}
              </motion.button>

              <motion.div
                className="text-center text-sm text-gray-500"
                variants={itemVariants}
              >
                Need password protection or analytics?{' '}
                <Link href="/auth/signin" className="text-white hover:underline">
                  Sign up for free
                </Link>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border border-gray-700">
                  <CheckCircle size={24} className="text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  Link Created Successfully
                </h3>
                <p className="text-gray-400 mb-6">
                  Your short link is ready to share
                </p>
              </motion.div>

              <motion.div
                className="border border-gray-700 rounded-lg p-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Your short link:</span>
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex items-center text-white hover:text-gray-300 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-1" />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                  <span className="text-white font-mono break-all">
                    {createdLink.shortUrl}
                  </span>
                </div>

                <motion.a
                  href={createdLink.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-gray-300 transition-colors text-sm"
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
                className="border border-gray-700 text-white px-6 py-2 rounded-lg hover:border-gray-600 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
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