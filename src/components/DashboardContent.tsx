/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinksList } from '@/components/LinksList';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Link as LinkIcon, Activity } from 'lucide-react';

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

export function DashboardContent() {
  const { data: session } = useSession();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      setLinks(data.links || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCreated = (newLink: Link) => {
    setLinks(prev => [newLink, ...prev]);
    setShowCreateForm(false);
  };

  const handleLinkDeleted = (linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="mb-8" variants={itemVariants}>
            <motion.h1
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Welcome back, {session?.user?.name || 'User'}!
            </motion.h1>
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              Manage your links and track their performance
            </motion.p>
          </motion.div>

          {/* Analytics Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <AnalyticsCard
                title="Total Links"
                value={links.length}
                icon={<LinkIcon size={24} className="text-black" />}
                bgGradient="bg-white"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnalyticsCard
                title="Total Clicks"
                value={totalClicks}
                icon={<TrendingUp size={24} className="text-black" />}
                bgGradient="bg-white"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnalyticsCard
                title="Active Links"
                value={links.filter(link => link.isActive).length}
                icon={<Activity size={24} className="text-black" />}
                bgGradient="bg-white"
              />
            </motion.div>
          </motion.div>

          {/* Create Link Button */}
          <motion.div className="mb-8" variants={itemVariants}>
            <motion.button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-black px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Create New Link
            </motion.button>
          </motion.div>

          {/* Create Link Form Modal */}
          {showCreateForm && (
            <CreateLinkForm
              onSubmit={handleLinkCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {/* Links List */}
          <motion.div variants={itemVariants}>
            <LinksList
              links={links}
              loading={loading}
              onLinkDeleted={handleLinkDeleted}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}