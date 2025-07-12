/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Copy, ExternalLink, Eye, Trash2, Calendar, Shield, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Link {
  password: any;
  id: string;
  shortCode: string;
  originalUrl: string;
  title?: string;
  description?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  domain?: { domain: string };
  clicks: number;
  shortUrl: string;
}

interface LinksListProps {
  links: Link[];
  loading: boolean;
  onLinkDeleted: (linkId: string) => void;
}

export function LinksList({ links, loading, onLinkDeleted }: LinksListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onLinkDeleted(linkId);
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  if (loading) {
    return (
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-20 bg-gray-700/50 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (links.length === 0) {
    return (
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Copy size={24} className="text-white" />
        </motion.div>
        <p className="text-gray-400 text-lg">No links created yet.</p>
        <p className="text-gray-500 text-sm mt-2">Create your first link to get started!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-black/70 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/30">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <motion.div
            className="w-2 h-2 bg-black rounded-full mr-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          Your Links ({links.length})
        </h2>
      </div>

      <motion.div
        className="divide-y divide-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {links.map((link) => (
            <motion.div
              key={link.id}
              className="p-6 hover:bg-black transition-all duration-200 group"
              variants={itemVariants}
              layout
              exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                      {link.title || link.shortCode}
                    </h3>
                    {link.expiresAt && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center"
                      >
                        <Calendar size={16} className="text-orange-400" />
                      </motion.div>
                    )}
                    {link.password && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center"
                        title="Password protected"
                      >
                        <Shield size={16} className="text-purple-400" />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <motion.span
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Eye size={14} className="mr-1 text-green-400" />
                      {link.clicks} clicks
                    </motion.span>
                    <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                    {link.expiresAt && (
                      <span className="text-orange-400">
                        Expires {new Date(link.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <motion.span
                        className="text-sm font-medium text-blue-400 bg-black px-3 py-1 rounded-full border border-blue-700/50"
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                      >
                        {link.shortUrl}
                      </motion.span>
                      <motion.button
                        onClick={() => copyToClipboard(link.shortUrl, link.id)}
                        className="text-gray-400 hover:text-blue-400 p-1 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy size={16} />
                      </motion.button>
                      <AnimatePresence>
                        {copiedId === link.id && (
                          <motion.span
                            className="text-green-400 text-sm flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                          >
                            <CheckCircle2 size={14} className="mr-1" />
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="text-sm text-gray-500 truncate bg-gray-700/30 px-3 py-1 rounded border border-gray-600/50">
                      → {link.originalUrl}
                    </div>
                  </div>

                  {link.description && (
                    <motion.p
                      className="text-sm text-gray-400 mt-3 bg-gray-700/20 px-3 py-2 rounded border border-gray-600/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {link.description}
                    </motion.p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={() => window.open(`/dashboard/analytics/${link.id}`, '_blank')}
                    className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-900/20 transition-all"
                    title="View Analytics"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => window.open(link.shortUrl, '_blank')}
                    className="text-gray-400 hover:text-green-400 p-2 rounded-lg hover:bg-green-900/20 transition-all"
                    title="Visit Link"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExternalLink size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(link.id)}
                    className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-900/20 transition-all"
                    title="Delete Link"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}