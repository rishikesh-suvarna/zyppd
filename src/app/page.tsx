'use client';

import Link from 'next/link';
import { Link2, BarChart3, Shield, Clock, Globe, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnonymousLinkForm } from '@/components/AnonymousLinkForm';
import Footer from '@/components/Footer';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  const features = [
    {
      icon: Link2,
      title: "Custom Short Links",
      description: "Create memorable, branded short links with custom codes that reflect your brand.",
      premium: false
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track clicks, geographic data, referrers, and more with detailed analytics dashboards.",
      premium: true
    },
    {
      icon: Shield,
      title: "Password Protection",
      description: "Secure your links with password protection to control access to your content.",
      premium: true
    },
    {
      icon: Clock,
      title: "Link Expiration",
      description: "Set expiration dates for your links to automatically disable them after a certain time.",
      premium: true
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Use your own domain for short links to maintain brand consistency.",
      premium: true
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with edge caching and global CDN for instant redirects worldwide.",
      premium: false
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "10K+", label: "Links Created" },
    { number: "500K+", label: "Clicks Tracked" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Form */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Shorten URLs.
            <br />
            <span className="text-gray-400">Track Everything.</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Create powerful short links with detailed analytics, password protection, and custom domains.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 items-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/auth/signin"
                className="bg-white text-black px-8 py-3 rounded-lg font-medium inline-flex items-center group"
              >
                Get Advanced Features
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Link Creation Form */}
        <motion.div variants={itemVariants}>
          <AnonymousLinkForm />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-20"
          variants={containerVariants}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-2xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="border-t border-gray-800 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Professional URL shortening with enterprise features that scale with your business.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                variants={itemVariants}
              >
                {/* Premium badge */}
                {feature.premium && (
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <span className="bg-white text-black px-2 py-1 rounded text-xs font-medium">
                      Premium
                    </span>
                  </div>
                )}

                {!feature.premium && (
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="text-white" size={24} />
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div >
  );
}