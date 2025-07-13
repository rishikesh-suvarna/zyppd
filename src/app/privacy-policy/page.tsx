'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  const dataTypes = [
    {
      icon: UserCheck,
      title: "Account Information",
      items: ["Email address", "Name (if provided)", "Profile information", "Authentication data"]
    },
    {
      icon: Eye,
      title: "Usage Data",
      items: ["IP addresses", "Browser information", "Device data", "Pages visited"]
    },
    {
      icon: Lock,
      title: "Link Data",
      items: ["Original URLs", "Custom codes", "Titles & descriptions", "Settings"]
    },
    {
      icon: Database,
      title: "Analytics Data",
      items: ["Click counts", "Geographic data", "Referrer info", "Timestamps"]
    }
  ];

  const userRights = [
    "Access your personal data",
    "Correct inaccurate information",
    "Delete your personal data",
    "Object to processing",
    "Data portability",
    "Withdraw consent"
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="mb-12" variants={itemVariants}>
            <Link
              href="/"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>

            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4">
                <Shield size={24} className="text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                <p className="text-gray-400 mt-1">Last updated: January 15, 2025</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">TL;DR:</strong> We collect data to provide our service and improve it.
                We don&apos;t sell your personal information. You have control over your data and can delete it anytime.
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div className="space-y-8" variants={itemVariants}>

            {/* Introduction */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Zyppd.cc respects your privacy and is committed to protecting your personal data. This Privacy Policy
                explains how we collect, use, and safeguard your information when you use our URL shortening service.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Information We Collect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataTypes.map((type) => (
                  <div key={type.title} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                        <type.icon size={16} className="text-white" />
                      </div>
                      <h3 className="font-medium text-white">{type.title}</h3>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {type.items.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* How We Use Information */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Service Provision</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Create and manage shortened links</li>
                    <li>• Provide analytics and reporting</li>
                    <li>• Authenticate users</li>
                    <li>• Process link settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Service Improvement</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Analyze usage patterns</li>
                    <li>• Develop new features</li>
                    <li>• Optimize performance</li>
                    <li>• Prevent fraud and abuse</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Information Sharing</h2>

              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Lock size={16} className="text-green-400 mr-2" />
                  <h3 className="font-medium text-white">We Do Not Sell Your Data</h3>
                </div>
                <p className="text-green-200 text-sm">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Third-Party Services</h3>
                  <p className="text-gray-300 text-sm mb-2">We may share data with:</p>
                  <ul className="text-gray-300 space-y-1 text-sm list-disc list-inside">
                    <li>Authentication Providers (Google)</li>
                    <li>Analytics Services for improvement</li>
                    <li>Cloud Providers for hosting</li>
                    <li>Payment Processors for billing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Data Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                    <Shield size={16} className="mr-2" />
                    Security Measures
                  </h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Encryption for transmission & storage</li>
                    <li>• Secure authentication systems</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and monitoring</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                    <Database size={16} className="mr-2" />
                    Data Retention
                  </h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Account data: While active</li>
                    <li>• Link data: Until deleted</li>
                    <li>• Analytics: 2 years (anonymized)</li>
                    <li>• Logs: 12 months</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Rights and Choices</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Data Rights (GDPR/CCPA)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {userRights.map((right, index) => (
                      <div key={index} className="flex items-center text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        {right}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Cookies and Tracking</h2>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  We use cookies for essential functionality, analytics, authentication, and preferences.
                  You can disable cookies in your browser settings, though this may affect functionality.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="text-center p-2 border border-gray-700 rounded">
                    <div className="text-white font-medium">Essential</div>
                    <div className="text-gray-400">Required</div>
                  </div>
                  <div className="text-center p-2 border border-gray-700 rounded">
                    <div className="text-white font-medium">Analytics</div>
                    <div className="text-gray-400">Usage stats</div>
                  </div>
                  <div className="text-center p-2 border border-gray-700 rounded">
                    <div className="text-white font-medium">Auth</div>
                    <div className="text-gray-400">Stay signed in</div>
                  </div>
                  <div className="text-center p-2 border border-gray-700 rounded">
                    <div className="text-white font-medium">Preferences</div>
                    <div className="text-gray-400">Settings</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Privacy Questions</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    For privacy-related questions or requests:
                  </p>
                  <p className="text-white text-sm"><strong>Email:</strong> support@zyppd.cc</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Data Protection Officer</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    For GDPR-related inquiries:
                  </p>
                  <p className="text-white text-sm"><strong>Email:</strong> support@zyppd.cc</p>
                </div>
              </div>
            </section>

          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-12 text-center border-t border-gray-800 pt-8"
            variants={itemVariants}
          >
            <p className="text-gray-500 text-sm">
              This Privacy Policy was last updated on January 15, 2025. Please review it periodically for changes.
            </p>
            <div className="mt-4 space-x-4">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}