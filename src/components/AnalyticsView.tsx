/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Globe, Eye, Users, BarChart3, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
  }, []);

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

  const statCards = analytics ? [
    {
      title: "Total Clicks",
      value: analytics.totalClicks,
      icon: Eye,
      gradient: "bg-black",
      iconColor: "text-white"
    },
    {
      title: "Last 7 Days",
      value: analytics.recentClicks,
      icon: Calendar,
      gradient: "bg-black",
      iconColor: "text-white"
    },
    {
      title: "Countries",
      value: Object.keys(analytics.countryStats).length,
      icon: Globe,
      gradient: "bg-black",
      iconColor: "text-white"
    },
    {
      title: "Unique Visitors",
      value: analytics.recentAnalytics.length,
      icon: Users,
      gradient: "bg-black",
      iconColor: "text-white"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-400 hover:text-white mb-6 group"
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </motion.button>
          </motion.div>

          {/* Link Info Card */}
          <motion.div
            className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 mb-8"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-3 flex items-center">
                  <BarChart3 size={28} className="mr-3 text-white" />
                  {link.title || link.shortCode}
                </h1>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="text-gray-400 w-24">Short URL:</span>
                    <span className="font-medium text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-700/50">
                      {shortUrl}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-24">Original:</span>
                    <span className="font-medium text-gray-200 truncate">{link.originalUrl}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-24">Created:</span>
                    <span className="text-gray-300">{new Date(link.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <motion.div
                className="w-16 h-16 bg-white rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BarChart3 size={24} className="text-black" />
              </motion.div>
            </div>
          </motion.div>

          {analytics && (
            <>
              {/* Stats Cards */}
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
                      className={`absolute inset-0 bg-black ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      initial={false}
                    />

                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                        <motion.p
                          className="text-2xl font-bold text-white"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        >
                          {card.value.toLocaleString()}
                        </motion.p>
                      </div>

                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <card.icon size={24} className="text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                variants={containerVariants}
              >
                {/* Daily Stats */}
                <motion.div
                  className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Calendar size={20} className="mr-2 text-white" />
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
                          <span className="text-sm text-gray-300">{new Date(date).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="bg-white h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(clicks / Math.max(...Object.values(analytics.dailyStats))) * 100}%`
                                }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.7 }}
                              />
                            </div>
                            <span className="text-sm font-medium text-white">{clicks}</span>
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
                            <div className="w-24 bg-gray-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="bg-white h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(clicks / Math.max(...Object.values(analytics.countryStats))) * 100}%`
                                }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.7 }}
                              />
                            </div>
                            <span className="text-sm font-medium text-white">{clicks}</span>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
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
                  {analytics.recentAnalytics.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-700/20 transition-colors border-b border-gray-700/50 last:border-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.6 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                        />
                        <div>
                          <span className="text-sm text-gray-300">
                            {new Date(activity.clickedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Globe size={14} className="text-white" />
                          <span className="bg-gray-700/50 px-2 py-1 rounded text-xs">
                            {activity.country || 'Unknown'}
                          </span>
                        </div>
                        <span className="bg-gray-700/50 px-2 py-1 rounded text-xs">
                          {activity.referer ? new URL(activity.referer).hostname : 'Direct'}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {analytics.recentAnalytics.length === 0 && (
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity size={24} className="text-white" />
                      </div>
                      <p className="text-gray-400">No recent activity</p>
                      <p className="text-gray-500 text-sm mt-1">Activity will appear here when people click your link</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}