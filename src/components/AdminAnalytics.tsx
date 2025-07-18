/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Link2,
  Eye,
  TrendingUp,
  Activity,
  Globe,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Clock,
  Shield,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, Area, AreaChart } from 'recharts';

interface AdminAnalyticsData {
  summary: {
    totalUsers: number;
    totalLinks: number;
    totalClicks: number;
    activeLinks: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    usersThisWeek: number;
    usersThisMonth: number;
    clickRate: string;
    activeRate: string;
  };
  topLinks: Array<{
    id: string;
    shortCode: string;
    title: string;
    originalUrl: string;
    clicks: number;
    userName: string;
    createdAt: string;
  }>;
  mostActiveUsers: Array<{
    id: string;
    name: string;
    email: string | null;
    linksCount: number;
    createdAt: string;
    isAdmin: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    linkId: string;
    shortCode: string;
    title: string;
    userName: string;
    clickedAt: string;
    country: string;
    userAgent?: string | null;
    referrer?: string | null;
  }>;
  dailyStats: {
    clicks: Record<string, number>;
    users: Record<string, number>;
    links: Record<string, number>;
  };
  countryStats: Record<string, number>;
  userGrowth: Record<string, number>;
  linkTrends: Record<string, number>;
}

interface AdminAnalyticsProps {
  data: AdminAnalyticsData;
}

export function AdminAnalytics({ data }: AdminAnalyticsProps) {
  const [isClient, setIsClient] = useState(false);
  const [activityLimit, setActivityLimit] = useState(15);

  // Add state for system health
  const [dbStatus, setDbStatus] = useState<'healthy' | 'down' | 'unknown'>('unknown');
  const [apiStatus, setApiStatus] = useState<'normal' | 'slow' | 'down' | 'unknown'>('unknown');
  const [storageUsed, setStorageUsed] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);

    fetch('/api/admin/health/db')
      .then(res => res.ok ? setDbStatus('healthy') : setDbStatus('down'))
      .catch(() => setDbStatus('down'));

    const start = Date.now();
    fetch('/api/admin/health/api')
      .then(res => {
        const duration = Date.now() - start;
        if (!res.ok) setApiStatus('down');
        else if (duration > 5000) setApiStatus('slow');
        else setApiStatus('normal');
      })
      .catch(() => setApiStatus('down'));

    fetch('/api/admin/health/storage')
      .then(res => res.json())
      .then(data => setStorageUsed(data.percentUsed))
      .catch(() => setStorageUsed(null));
  }, []);

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
      transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] as const }
    }
  };

  const calculateGrowth = (thisWeek: number, thisMonth: number) => {
    const weeklyAverage = thisWeek;
    const monthlyAverage = thisMonth / 4; // Approximate weekly average from monthly
    if (monthlyAverage === 0) return 0;
    return ((weeklyAverage - monthlyAverage) / monthlyAverage * 100);
  };

  const userGrowth = calculateGrowth(data.summary.usersThisWeek, data.summary.usersThisMonth);
  const clickGrowth = calculateGrowth(data.summary.clicksThisWeek, data.summary.clicksThisMonth);

  // Prepare chart data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyChartData = last30Days.map(date => ({
    date: isClient ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : date,
    clicks: data.dailyStats.clicks[date] || 0,
    users: data.dailyStats.users[date] || 0,
    links: data.dailyStats.links[date] || 0
  }));

  const countryChartData = Object.entries(data.countryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([country, clicks]) => ({
      country,
      clicks,
      percentage: ((clicks / data.summary.totalClicks) * 100).toFixed(1)
    }));

  const growthChartData = Object.entries(data.userGrowth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, users]) => ({
      month: isClient ? new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : month,
      users,
      links: data.linkTrends[month] || 0
    }));

  const pieChartData = [
    { name: 'Active Links', value: data.summary.activeLinks, color: '#ffffff' },
    { name: 'Inactive Links', value: data.summary.totalLinks - data.summary.activeLinks, color: '#6b7280' }
  ];

  const statCards = [
    {
      title: "Total Users",
      value: data.summary.totalUsers,
      change: userGrowth,
      icon: Users,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Total Links",
      value: data.summary.totalLinks,
      change: 0,
      icon: Link2,
      gradient: "from-green-500 to-blue-600"
    },
    {
      title: "Total Clicks",
      value: data.summary.totalClicks,
      change: clickGrowth,
      icon: Eye,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Active Links",
      value: data.summary.activeLinks,
      change: 0,
      icon: Activity,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const formatDate = (dateString: string) => {
    if (!isClient) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    if (!isClient) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrentTime = () => {
    if (!isClient) return 'Loading...';
    return new Date().toLocaleString();
  };

  const getTodaysStats = (stats: Record<string, number>) => {
    if (!isClient) return 0;
    const today = new Date().toISOString().split('T')[0];
    return stats[today] || 0;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Shield className="mr-3 text-white" size={32} />
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Monitor and analyze your link shortener platform</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Last updated</p>
              <p className="text-white font-medium">{getCurrentTime()}</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {statCards.map((card) => (
            <motion.div
              key={card.title}
              className="bg-black border border-gray-700 rounded-xl p-6 relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(card.change)}
                  <span className={`text-sm font-medium ${getChangeColor(card.change)}`}>
                    {card.change !== 0 ? `${Math.abs(card.change).toFixed(1)}%` : '—'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">{card.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="mr-2 text-white" size={20} />
              This Week vs Month
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">New Users</span>
                <div className="text-right">
                  <p className="text-white font-medium">{data.summary.usersThisWeek} / {data.summary.usersThisMonth}</p>
                  <p className="text-xs text-gray-400">Week / Month</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Clicks</span>
                <div className="text-right">
                  <p className="text-white font-medium">{data.summary.clicksThisWeek.toLocaleString()} / {data.summary.clicksThisMonth.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Week / Month</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Click Rate</span>
                <div className="text-right">
                  <p className="text-white font-medium">{data.summary.clickRate}%</p>
                  <p className="text-xs text-gray-400">Clicks per link</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Rate</span>
                <div className="text-right">
                  <p className="text-white font-medium">{data.summary.activeRate}%</p>
                  <p className="text-xs text-gray-400">Active links</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="mr-2 text-white" size={20} />
              Link Status Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {pieChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Globe className="mr-2 text-white" size={20} />
              Top Countries
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {countryChartData.slice(0, 8).map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-white">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{country.clicks}</p>
                    <p className="text-xs text-gray-400">{country.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Daily Activity Chart */}
          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <LineChart className="mr-2 text-white" size={20} />
              Daily Activity (Last 30 Days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#ffffff"
                    fill="#ffffff"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Growth Trends */}
          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2 text-white" size={20} />
              Growth Trends (Last 12 Months)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={growthChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#ffffff"
                    strokeWidth={2}
                    dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
                    name="New Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="links"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                    name="New Links"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Data Tables */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Top Performing Links */}
          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="mr-2 text-white" size={20} />
              Top Performing Links
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3 text-sm font-medium text-gray-400">Link</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">User</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Clicks</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topLinks.slice(0, 8).map((link, index) => (
                    <tr key={link.id} className="border-b border-gray-800">
                      <td className="py-3">
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-32">
                            {link.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-32">
                            /{link.shortCode}
                          </p>
                        </div>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-gray-300 truncate max-w-24">
                          {link.userName}
                        </p>
                      </td>
                      <td className="py-3">
                        <span className="text-sm font-medium text-white">
                          {link.clicks}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-gray-400 hover:text-white">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Most Active Users */}
          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="mr-2 text-white" size={20} />
              Most Active Users
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3 text-sm font-medium text-gray-400">User</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Links</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Role</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.mostActiveUsers.slice(0, 8).map((user, index) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="py-3">
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-32">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-32">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm font-medium text-white">
                          {user.linksCount}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${user.isAdmin
                          ? 'bg-white text-black'
                          : 'bg-gray-700 text-gray-300'
                          }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-xs text-gray-400">
                          {formatDateShort(user.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          className="bg-black border border-gray-700 rounded-xl p-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Clock className="mr-2 text-white" size={20} />
              Recent Activity
            </h3>
            <span className="text-sm text-gray-400">
              Last {data.recentActivity.length} clicks
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 text-sm font-medium text-gray-400">Link</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">User</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Country</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Time</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.slice(0, activityLimit).map((activity, index) => (
                  <motion.tr
                    key={activity.id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 + 0.5 }}
                  >
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-40">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            /{activity.shortCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-300 truncate max-w-32">
                        {activity.userName}
                      </p>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-1">
                        <Globe size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {activity.country}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-gray-400">
                        {formatDate(activity.clickedAt)}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.recentActivity.length > activityLimit && (
            <div className="mt-4 text-center">
              <button
                className="text-white hover:text-gray-300 text-sm transition-colors"
                onClick={() => setActivityLimit((prev) => prev + 15)}
              >
                Load more activity →
              </button>
            </div>
          )}
        </motion.div>

        {/* System Health Indicators */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${dbStatus === 'healthy' ? 'bg-emerald-500' : dbStatus === 'down' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                  <span className={`text-sm ${dbStatus === 'healthy' ? 'text-emerald-500' : dbStatus === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                    {dbStatus === 'healthy' ? 'Healthy' : dbStatus === 'down' ? 'Down' : 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">API Response</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${apiStatus === 'normal' ? 'bg-emerald-500' : apiStatus === 'slow' ? 'bg-yellow-400' : apiStatus === 'down' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                  <span className={`text-sm ${apiStatus === 'normal' ? 'text-emerald-500' : apiStatus === 'slow' ? 'text-yellow-400' : apiStatus === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                    {apiStatus === 'normal' ? 'Normal' : apiStatus === 'slow' ? 'Slow' : apiStatus === 'down' ? 'Down' : 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Storage</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${storageUsed !== null
                    ? storageUsed < 80 ? 'bg-emerald-500' : storageUsed < 95 ? 'bg-yellow-400' : 'bg-red-500'
                    : 'bg-gray-400'
                    }`} />
                  <span className={`text-sm ${storageUsed !== null
                    ? storageUsed < 80 ? 'text-emerald-500' : storageUsed < 95 ? 'text-yellow-400' : 'text-red-500'
                    : 'text-gray-400'
                    }`}>
                    {storageUsed !== null ? `${storageUsed}% Used` : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg. Clicks/Link</span>
                <span className="text-white font-medium">
                  {data.summary.totalLinks > 0
                    ? (data.summary.totalClicks / data.summary.totalLinks).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Clicks Today</span>
                <span className="text-white font-medium">
                  {getTodaysStats(data.dailyStats.clicks)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">New Users Today</span>
                <span className="text-white font-medium">
                  {getTodaysStats(data.dailyStats.users)}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-black border border-gray-700 rounded-xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Platform Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Revenue</span>
                <span className="text-white font-medium">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Server Uptime</span>
                <span className="text-green-400 font-medium">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Data Processed</span>
                <span className="text-white font-medium">
                  {(data.summary.totalClicks * 0.5).toFixed(1)}KB
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}