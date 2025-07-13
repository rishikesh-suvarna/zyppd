/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  User,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Settings as SettingsIcon,
  Save
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { parseDate } from '@/utils/parseDate';

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
        console.log({ user: { ...session?.user, name: formData.get('name') } })
        await update({ user: { ...session?.user, name: formData.get('name') } });
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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <SettingsIcon size={28} className="text-black" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-3">Account Settings</h1>
            <p className="text-gray-400 text-lg">Manage your profile and account preferences</p>
          </motion.div>

          {/* Navigation */}
          <motion.div className="flex justify-center" variants={itemVariants}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2">
              <nav className="flex space-x-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={18} className="mr-2" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div className="max-w-3xl mx-auto" variants={itemVariants}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    className="p-8"
                    key="profile"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                      <p className="text-gray-400">Update your personal details and preferences</p>
                    </div>

                    <form action={updateProfile} className="space-y-8">
                      {/* Profile Photo */}
                      <motion.div
                        className="flex flex-col items-center space-y-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {session?.user?.image ? (
                            <Image
                              src={session.user.image}
                              alt={session.user.name || ''}
                              width={80}
                              height={80}
                              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center ring-4 ring-white/20">
                              <User size={32} className="text-black" />
                            </div>
                          )}
                        </motion.div>
                        <div className="text-center">
                          <h3 className="text-white font-medium">Profile Photo</h3>
                          <p className="text-gray-400 text-sm">Managed by your OAuth provider</p>
                        </div>
                      </motion.div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-white font-medium mb-3">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            defaultValue={userData?.name || session?.user?.name || ''}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-white placeholder-gray-400 transition-all"
                            placeholder="Enter your full name"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block text-white font-medium mb-3">Email Address</label>
                          <input
                            type="email"
                            value={userData?.email || session?.user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                          />
                          <p className="text-gray-500 text-xs mt-2">Email cannot be changed</p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block text-white font-medium mb-3">Account Tier</label>
                          <div className="flex items-center space-x-3">
                            <motion.span
                              className={`px-4 py-2 text-sm font-medium rounded-xl ${userData?.tier === 'PREMIUM'
                                ? 'bg-white text-black'
                                : 'bg-white/10 text-white border border-white/20'
                                }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {userData?.tier || 'FREE'}
                            </motion.span>
                            {userData?.tier === 'FREE' && (
                              <motion.button
                                type="button"
                                className="text-white/70 hover:text-white text-sm font-medium underline"
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
                          <label className="block text-white font-medium mb-3">Member Since</label>
                          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-white">
                              {userData?.createdAt
                                ? parseDate(userData.createdAt)
                                : 'Unknown'
                              }
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Save Button */}
                      <motion.div
                        className="flex justify-center pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="bg-white text-black px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
                          whileHover={{ scale: loading ? 1 : 1.02 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                          {loading ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                              />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save size={18} />
                              <span>Save Changes</span>
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </form>
                    {/* Success/Error Messages */}
                    <AnimatePresence>
                      {success && (
                        <motion.div
                          className="max-w-2xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-4 mt-4 backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.9, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center justify-center">
                            <Check className="text-white mr-3" size={20} />
                            <span className="text-white font-medium">{success}</span>
                          </div>
                        </motion.div>
                      )}

                      {error && (
                        <motion.div
                          className="max-w-2xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.9, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center justify-center">
                            <X className="text-white mr-3" size={20} />
                            <span className="text-white font-medium">{error}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === 'danger' && (
                  <motion.div
                    className="p-8"
                    key="danger"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <AlertTriangle size={28} className="text-white" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white mb-2">Danger Zone</h2>
                      <p className="text-gray-400">Irreversible actions that affect your account</p>
                    </div>

                    <motion.div
                      className="bg-white/5 border border-white/10 rounded-2xl p-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-3">Delete Account</h3>
                        <p className="text-gray-400 mb-6">
                          Permanently delete your account and all associated data.
                          This action cannot be undone.
                        </p>

                        <motion.div
                          className="bg-white/5 rounded-xl p-4 mb-6"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <p className="text-white/80 text-sm mb-3">This will permanently delete:</p>
                          <div className="space-y-2">
                            {[
                              'All your shortened links',
                              'Analytics and click data',
                              'Custom domains',
                              'Account settings and preferences'
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center justify-center space-x-2 text-white/70 text-sm"
                                variants={itemVariants}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                                <span>{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        <motion.button
                          onClick={deleteAccount}
                          className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center space-x-2 mx-auto"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Trash2 size={18} />
                          <span>Delete My Account</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}