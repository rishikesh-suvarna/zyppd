'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  Link2,
  Globe,
  TrendingUp,
  Calendar,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface AnalyticsSummary {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  topLinks: Array<{
    id: string;
    shortCode: string;
    title: string;
    originalUrl: string;
    clicks: number;
  }>;
  recentActivity: Array<{
    linkId: string;
    shortCode: string;
    title: string;
    clickedAt: string;
    country: string;
  }>;
  dailyStats: Record<string, number>;
  countryStats: Record<string, number>;
}

export function OverallAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Overview</h1>
          <p className="text-gray-600">Track your link performance and engagement metrics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Links</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalLinks}</p>
              </div>
              <Link2 className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalClicks.toLocaleString()}</p>
              </div>
              <Eye className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.clicksThisWeek.toLocaleString()}</p>
              </div>
              <Calendar className="text-purple-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.clicksThisMonth.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Links</h3>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {analytics.topLinks.slice(0, 5).map((link, index) => (
                <div key={link.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {link.title || link.shortCode}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{link.originalUrl}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {link.clicks} clicks
                    </span>
                    <Link
                      href={`/dashboard/analytics/${link.id}`}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>

            <div className="space-y-3">
              {analytics.recentActivity.slice(0, 8).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title || activity.shortCode}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.clickedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.country || 'Unknown'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Clicks Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Clicks (Last 30 Days)</h3>
            <div className="space-y-2">
              {Object.entries(analytics.dailyStats)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 10)
                .map(([date, clicks]) => (
                  <div key={date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(clicks / Math.max(...Object.values(analytics.dailyStats))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {clicks}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Country Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Countries</h3>
            <div className="space-y-2">
              {Object.entries(analytics.countryStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([country, clicks]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(clicks / Math.max(...Object.values(analytics.countryStats))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {clicks}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}