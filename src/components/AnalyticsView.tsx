/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Globe, Eye, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  title?: string;
  createdAt: string;
  domain?: { domain: string };
}

interface AnalyticsData {
  totalClicks: number;
  recentClicks: number;
  countryStats: Record<string, number>;
  dailyStats: Record<string, number>;
  recentAnalytics: any[];
}

export function AnalyticsView({ link }: { link: Link }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, [link.id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/links/${link.id}/analytics`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const shortUrl = link.domain
    ? `https://${link.domain.domain}/${link.shortCode}`
    : `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.shortCode}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {link.title || link.shortCode}
            </h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Short URL: <span className="font-medium text-blue-600">{shortUrl}</span></p>
              <p>Original URL: <span className="font-medium">{link.originalUrl}</span></p>
              <p>Created: {new Date(link.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {analytics && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalClicks}</p>
                    </div>
                    <Eye className="text-blue-500" size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last 7 Days</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.recentClicks}</p>
                    </div>
                    <Calendar className="text-green-500" size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Countries</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Object.keys(analytics.countryStats).length}
                      </p>
                    </div>
                    <Globe className="text-purple-500" size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.recentAnalytics.length}</p>
                    </div>
                    <Users className="text-orange-500" size={24} />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Daily Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Clicks (Last 30 Days)</h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.dailyStats)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .slice(0, 10)
                      .map(([date, clicks]) => (
                        <div key={date} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(clicks / Math.max(...Object.values(analytics.dailyStats))) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{clicks}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Country Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.countryStats)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 10)
                      .map(([country, clicks]) => (
                        <div key={country} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{country}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(clicks / Math.max(...Object.values(analytics.countryStats))) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{clicks}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {analytics.recentAnalytics.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {new Date(activity.clickedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{activity.country || 'Unknown'}</span>
                        <span>{activity.referer ? new URL(activity.referer).hostname : 'Direct'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}