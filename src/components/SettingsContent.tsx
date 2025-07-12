/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  User,
  Globe,
  Shield,
  Trash2,
  Plus,
  Crown,
  ExternalLink,
  AlertTriangle,
  Check,
  X,
  Settings as SettingsIcon,
  Save
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
  id: string;
  email: string;
  name: string;
  image: string;
  tier: 'FREE' | 'PREMIUM';
  createdAt: string;
}

interface Domain {
  id: string;
  domain: string;
  isActive: boolean;
  createdAt: string;
}

export function SettingsContent() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchDomains();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  const updateProfile = async (formData: FormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
        }),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully');
        await update(); // Update the session
        fetchUserData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });

      if (response.ok) {
        setSuccess('Domain added successfully');
        setNewDomain('');
        fetchDomains();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add domain');
      }
    } catch (error) {
      setError('An error occurred while adding the domain');
    } finally {
      setLoading(false);
    }
  };

  const deleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;

    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Domain deleted successfully');
        fetchDomains();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete domain');
      }
    } catch (error) {
      setError('An error occurred while deleting the domain');
    }
  };

  const deleteAccount = async () => {
    const confirmText = 'DELETE MY ACCOUNT';
    const userInput = prompt(
      `This action cannot be undone. All your links and data will be permanently deleted.\n\nType "${confirmText}" to confirm:`
    );

    if (userInput !== confirmText) return;

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });

      if (response.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete account');
      }
    } catch (error) {
      setError('An error occurred while deleting your account');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-blue-500 to-cyan-500' },
    // { id: 'domains', label: 'Custom Domains', icon: Globe, gradient: 'from-green-500 to-emerald-500' },
    // { id: 'security', label: 'Security', icon: Shield, gradient: 'from-purple-500 to-violet-500' },
    // { id: 'billing', label: 'Billing', icon: Crown, gradient: 'from-yellow-500 to-amber-500' },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, gradient: 'from-red-500 to-pink-500' },
  ];

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

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 }
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
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <SettingsIcon size={32} className="mr-3 text-blue-400" />
              Settings
            </h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </motion.div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="mb-6 bg-green-900/50 border border-green-700 rounded-lg p-4 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3" size={20} />
                  <span className="text-green-200">{success}</span>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <X className="text-red-400 mr-3" size={20} />
                  <span className="text-red-200">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all relative overflow-hidden group ${isActive
                            ? 'bg-gray-700/50 text-white border border-gray-600'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Gradient overlay for active tab */}
                        {isActive && (
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-10`}
                            layoutId="activeTab"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}

                        <motion.div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${isActive ? `bg-gradient-to-br ${tab.gradient}` : 'bg-gray-700'
                            }`}
                          whileHover={{ rotate: 5 }}
                        >
                          <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                        </motion.div>
                        <span className="relative z-10">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div className="lg:col-span-3" variants={itemVariants}>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      className="p-6"
                      key="profile"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                        <User size={20} className="mr-2 text-blue-400" />
                        Profile Information
                      </h2>

                      <form action={updateProfile} className="space-y-6">
                        <motion.div
                          className="flex items-center space-x-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {session?.user?.image ? (
                              <Image
                                src={session.user.image}
                                alt={session.user.name || ''}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-full ring-2 ring-blue-500/50"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User size={24} className="text-white" />
                              </div>
                            )}
                          </motion.div>
                          <div>
                            <h3 className="text-sm font-medium text-white">Profile Photo</h3>
                            <p className="text-sm text-gray-400">
                              Your profile photo is managed by your OAuth provider
                            </p>
                          </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              defaultValue={userData?.name || session?.user?.name || ''}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={userData?.email || session?.user?.email || ''}
                              disabled
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Email cannot be changed
                            </p>
                          </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Account Tier
                            </label>
                            <div className="flex items-center space-x-3">
                              <motion.span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${userData?.tier === 'PREMIUM'
                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                                    : 'bg-gray-700 text-gray-300'
                                  }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {userData?.tier || 'FREE'}
                              </motion.span>
                              {userData?.tier === 'FREE' && (
                                <motion.button
                                  type="button"
                                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Upgrade to Premium
                                </motion.button>
                              )}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Member Since
                            </label>
                            <p className="text-sm text-white bg-gray-700/30 px-4 py-3 rounded-lg border border-gray-600">
                              {userData?.createdAt
                                ? new Date(userData.createdAt).toLocaleDateString()
                                : 'Unknown'
                              }
                            </p>
                          </motion.div>
                        </div>

                        <motion.div
                          className="pt-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <motion.button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium flex items-center"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                          >
                            {loading ? (
                              <>
                                <motion.div
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1 }}
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </motion.button>
                        </motion.div>
                      </form>
                    </motion.div>
                  )}

                  {/* Danger Zone Tab */}
                  {activeTab === 'danger' && (
                    <motion.div
                      className="p-6"
                      key="danger"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                        <AlertTriangle size={20} className="mr-2 text-red-400" />
                        Danger Zone
                      </h2>

                      <motion.div
                        className="border border-red-700/50 rounded-xl p-6 bg-red-900/20 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start space-x-4">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                          >
                            <AlertTriangle className="text-red-400 mt-1" size={24} />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-medium text-red-300 mb-2">Delete Account</h3>
                            <p className="text-sm text-red-200 mb-4">
                              Permanently delete your account and all associated data.
                              This action cannot be undone and will immediately delete:
                            </p>
                            <motion.ul
                              className="text-sm text-red-200 space-y-1 mb-6"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              {[
                                'All your shortened links',
                                'Analytics data',
                                'Custom domains',
                                'Account settings'
                              ].map((item, index) => (
                                <motion.li
                                  key={index}
                                  className="flex items-center"
                                  variants={itemVariants}
                                  transition={{ delay: index * 0.1 + 0.3 }}
                                >
                                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3" />
                                  {item}
                                </motion.li>
                              ))}
                            </motion.ul>
                            <motion.button
                              onClick={deleteAccount}
                              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              <Trash2 size={16} className="mr-2 group-hover:rotate-12 transition-transform" />
                              Delete My Account
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}