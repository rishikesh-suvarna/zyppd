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
  ArrowRight,
  Activity,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { parseDate } from '@/utils/parseDate';

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
      transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] as const } // cubic-bezier for easeOut
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-red-400 mb-4 text-lg">{error}</div>
          <motion.button
            onClick={fetchAnalytics}
            className="bg-black text-white px-6 py-3 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-gray-400">No analytics data available</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Links",
      value: analytics.totalLinks,
      icon: Link2,
      gradient: "bg-white",
      iconColor: "text-black"
    },
    {
      title: "Total Clicks",
      value: analytics.totalClicks,
      icon: Eye,
      gradient: "bg-white",
      iconColor: "text-black"
    },
    {
      title: "This Week",
      value: analytics.clicksThisWeek,
      icon: Calendar,
      gradient: "bg-white",
      iconColor: "text-black"
    },
    {
      title: "This Month",
      value: analytics.clicksThisMonth,
      icon: TrendingUp,
      gradient: "bg-white",
      iconColor: "text-black"
    }
  ];

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
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <BarChart3 size={32} className="mr-3 text-white" />
              Analytics Overview
            </h1>
            <p className="text-gray-400">Track your link performance and engagement metrics</p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
          >
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 relative overflow-hidden group"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  initial={false}
                />

                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                      {card.value.toLocaleString()}
                    </motion.p>
                  </div>

                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <card.icon size={24} className="text-black" />
                  </motion.div>
                </div>

                {/* Subtle animation elements */}
                <motion.div
                  className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${card.gradient} rounded-full opacity-5`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Performing Links */}
            <motion.div
              className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full mr-3"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  Top Performing Links
                </h3>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/dashboard"
                    className="text-white flex items-center text-sm group"
                  >
                    View All
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <div className="space-y-4">
                {analytics.topLinks.slice(0, 5).map((link, index) => (
                  <motion.div
                    key={link.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <motion.span
                          className="text-sm font-medium text-gray-400 bg-gray-700 px-2 py-1 rounded"
                          whileHover={{ scale: 1.1 }}
                        >
                          #{index + 1}
                        </motion.span>
                        <p className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                          {link.title || link.shortCode}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-1 ml-8">{link.originalUrl}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-white">
                        {link.clicks} clicks
                      </span>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link
                          href={`/dashboard/analytics/${link.id}`}
                          className="text-gray-400 hover:text-blue-400 p-1 rounded"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Activity size={20} className="mr-2 text-white" />
                Recent Activity
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analytics.recentActivity.slice(0, 8).map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-700/20 transition-colors border-b border-gray-700/50 last:border-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                      />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {activity.title || activity.shortCode}
                        </p>
                        <p className="text-xs text-gray-400">
                          {parseDate(activity.clickedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe size={14} className="text-white" />
                      <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                        {activity.country || 'Unknown'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {/* Daily Clicks Chart */}
            <motion.div
              className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <TrendingUp size={20} className="mr-2 text-blue-400" />
                Daily Clicks (Last 30 Days)
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.dailyStats)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 10)
                  .map(([date, clicks], index) => (
                    <motion.div
                      key={date}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.5 }}
                    >
                      <span className="text-sm text-gray-300">
                        {parseDate(date)}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-white h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(clicks / Math.max(...Object.values(analytics.dailyStats))) * 100}%`
                            }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.7 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white w-12 text-right">
                          {clicks}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {/* Country Stats */}
            <motion.div
              className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Globe size={20} className="mr-2 text-white" />
                Top Countries
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.countryStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([country, clicks], index) => (
                    <motion.div
                      key={country}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.5 }}
                    >
                      <span className="text-sm text-gray-300">{country}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-white h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(clicks / Math.max(...Object.values(analytics.countryStats))) * 100}%`
                            }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.7 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white w-12 text-right">
                          {clicks}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}