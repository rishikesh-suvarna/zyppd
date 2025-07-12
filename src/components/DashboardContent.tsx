/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinksList } from '@/components/LinksList';
import { AnalyticsCard } from '@/components/AnalyticsCard';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {session?.user?.name || 'User'}!
          </h1>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnalyticsCard
              title="Total Links"
              value={links.length}
              icon="🔗"
            />
            <AnalyticsCard
              title="Total Clicks"
              value={totalClicks}
              icon="👆"
            />
            <AnalyticsCard
              title="Active Links"
              value={links.filter(link => link.isActive).length}
              icon="✅"
            />
          </div>

          {/* Create Link Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New Link
            </button>
          </div>

          {/* Create Link Form Modal */}
          {showCreateForm && (
            <CreateLinkForm
              onSubmit={handleLinkCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {/* Links List */}
          <LinksList
            links={links}
            loading={loading}
            onLinkDeleted={handleLinkDeleted}
          />
        </div>
      </div>
    </div>
  );
}