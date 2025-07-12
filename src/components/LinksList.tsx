'use client';

import { useState } from 'react';
import { Copy, ExternalLink, Eye, Trash2, Calendar, Shield } from 'lucide-react';

interface Link {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No links created yet. Create your first link!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Your Links</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {links.map((link) => (
          <div key={link.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {link.title || link.shortCode}
                  </h3>
                  {link.expiresAt && (
                    <Calendar size={16} className="text-orange-500" title="Has expiration date" />
                  )}
                  {link.password && (
                    <Shield size={16} className="text-blue-500" title="Password protected" />
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <span>{link.clicks} clicks</span>
                  <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                  {link.expiresAt && (
                    <span>Expires {new Date(link.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-600">{link.shortUrl}</span>
                    <button
                      onClick={() => copyToClipboard(link.shortUrl, link.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy size={16} />
                    </button>
                    {copiedId === link.id && (
                      <span className="text-green-600 text-sm">Copied!</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    → {link.originalUrl}
                  </div>
                </div>

                {link.description && (
                  <p className="text-sm text-gray-600 mt-2">{link.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => window.open(`/dashboard/analytics/${link.id}`, '_blank')}
                  className="text-gray-400 hover:text-blue-600"
                  title="View Analytics"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => window.open(link.shortUrl, '_blank')}
                  className="text-gray-400 hover:text-green-600"
                  title="Visit Link"
                >
                  <ExternalLink size={18} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete Link"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}