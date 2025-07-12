/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  X
} from 'lucide-react';

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
        window.location.href = '/';
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
    // { id: 'domains', label: 'Custom Domains', icon: Globe },
    // { id: 'security', label: 'Security', icon: Shield },
    // { id: 'billing', label: 'Billing', icon: Crown },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <Check className="text-green-600 mr-2" size={16} />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <X className="text-red-600 mr-2" size={16} />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={16} className="mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

                  <form action={updateProfile} className="space-y-6">
                    <div className="flex items-center space-x-6">
                      {session?.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || ''}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <User size={24} className="text-gray-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
                        <p className="text-sm text-gray-500">
                          Your profile photo is managed by your OAuth provider
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={userData?.name || session?.user?.name || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={userData?.email || session?.user?.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Tier
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${userData?.tier === 'PREMIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {userData?.tier || 'FREE'}
                          </span>
                          {userData?.tier === 'FREE' && (
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Upgrade to Premium
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <p className="text-sm text-gray-900">
                          {userData?.createdAt
                            ? new Date(userData.createdAt).toLocaleDateString()
                            : 'Unknown'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Domains Tab */}
              {activeTab === 'domains' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Custom Domains</h2>
                      <p className="text-sm text-gray-600">
                        Add custom domains for your short links (Premium feature)
                      </p>
                    </div>
                    {userData?.tier !== 'PREMIUM' && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded-full">
                        Premium Only
                      </span>
                    )}
                  </div>

                  {userData?.tier === 'PREMIUM' ? (
                    <>
                      {/* Add Domain Form */}
                      <form onSubmit={addDomain} className="mb-6">
                        <div className="flex space-x-4">
                          <input
                            type="text"
                            placeholder="example.com"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                          >
                            <Plus size={16} className="mr-2" />
                            Add Domain
                          </button>
                        </div>
                      </form>

                      {/* Domains List */}
                      <div className="space-y-4">
                        {domains.map((domain) => (
                          <div key={domain.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                            <div className="flex items-center space-x-3">
                              <Globe size={20} className="text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{domain.domain}</p>
                                <p className="text-sm text-gray-500">
                                  Added {new Date(domain.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${domain.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {domain.isActive ? 'Active' : 'Pending'}
                              </span>
                              <button
                                onClick={() => deleteDomain(domain.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {domains.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No custom domains added yet
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Crown size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Premium Feature
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Custom domains are available with Premium subscription
                      </p>
                      <button className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700">
                        Upgrade to Premium
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security</h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Login Activity</h3>
                          <p className="text-sm text-gray-600">
                            View recent login activity and manage sessions
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                          View Activity
                          <ExternalLink size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">API Keys</h3>
                          <p className="text-sm text-gray-600">
                            Manage API keys for programmatic access
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Manage Keys
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing</h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Current Plan</h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${userData?.tier === 'PREMIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {userData?.tier || 'FREE'}
                        </span>
                      </div>

                      {userData?.tier === 'FREE' ? (
                        <div>
                          <p className="text-gray-600 mb-4">
                            You&apos;re currently on the free plan with basic features.
                          </p>
                          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                            Upgrade to Premium - $9.99/month
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-4">
                            You have access to all premium features including custom domains and advanced analytics.
                          </p>
                          <div className="flex space-x-4">
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                              View Billing History
                            </button>
                            <button className="text-red-600 hover:text-red-700 font-medium">
                              Cancel Subscription
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Free Plan</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Up to 100 links</li>
                          <li>• Basic analytics</li>
                          <li>• Password protection</li>
                          <li>• Link expiration</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Premium Plan</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Unlimited links</li>
                          <li>• Advanced analytics</li>
                          <li>• Custom domains</li>
                          <li>• API access</li>
                          <li>• Priority support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Danger Zone</h2>

                  <div className="border border-red-200 rounded-md p-6 bg-red-50">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="text-red-600 mt-1" size={20} />
                      <div className="flex-1">
                        <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                        <p className="text-sm text-red-700 mb-4">
                          Permanently delete your account and all associated data.
                          This action cannot be undone and will immediately delete:
                        </p>
                        <ul className="text-sm text-red-700 space-y-1 mb-4">
                          <li>• All your shortened links</li>
                          <li>• Analytics data</li>
                          <li>• Custom domains</li>
                          <li>• Account settings</li>
                        </ul>
                        <button
                          onClick={deleteAccount}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
                        >
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}