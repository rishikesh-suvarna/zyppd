'use client';

import Link from 'next/link';
import { Link2, BarChart3, Shield, Clock, Globe, Zap, ArrowRight, Sparkles, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnonymousLinkForm } from '@/components/AnonymousLinkForm';

export default function HomePage() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const features = [
    {
      icon: Link2,
      title: "Custom Short Links",
      description: "Create memorable, branded short links with custom codes that reflect your brand.",
      bgColor: "bg-blue-900/50",
      iconColor: "text-blue-400",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track clicks, geographic data, referrers, and more with detailed analytics dashboards.",
      bgColor: "bg-green-900/50",
      iconColor: "text-green-400",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Password Protection",
      description: "Secure your links with password protection to control access to your content.",
      bgColor: "bg-purple-900/50",
      iconColor: "text-purple-400",
      gradient: "from-purple-500 to-violet-500",
      premium: true
    },
    {
      icon: Clock,
      title: "Link Expiration",
      description: "Set expiration dates for your links to automatically disable them after a certain time.",
      bgColor: "bg-orange-900/50",
      iconColor: "text-orange-400",
      gradient: "from-orange-500 to-red-500",
      premium: true
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Use your own domain for short links to maintain brand consistency.",
      bgColor: "bg-red-900/50",
      iconColor: "text-red-400",
      gradient: "from-red-500 to-pink-500",
      premium: true
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with edge caching and global CDN for instant redirects worldwide.",
      bgColor: "bg-yellow-900/50",
      iconColor: "text-yellow-400",
      gradient: "from-yellow-500 to-amber-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "1M+", label: "Links Created" },
    { number: "50M+", label: "Clicks Tracked" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Elements */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />
        </motion.div>

        <div className="text-center relative z-10">
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles size={16} className="text-blue-400 mr-2" />
              <span className="text-gray-300 text-sm">Trusted by 10,000+ professionals</span>
              <motion.div
                className="ml-2 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="text-yellow-400 fill-current" />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Professional URL
            <motion.span
              className="text-white"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              <br />Shortening
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Transform your long URLs into powerful, trackable short links. Get detailed analytics,
            password protection, and custom domains to boost your marketing campaigns.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 items-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/auth/signin"
                className="bg-white text-black px-8 py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl inline-flex items-center group text-lg"
              >
                Get Started Free
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#try-now"
                className="border border-gray-600 text-gray-200 px-8 py-4 rounded-xl hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200 font-semibold backdrop-blur-sm text-lg"
              >
                Try Now
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-3xl font-bold text-white mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Try It Now Section */}
      <motion.div
        id="try-now"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-blue-900/20 rounded-full border border-blue-700/50 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Link2 size={16} className="text-blue-400 mr-2" />
            <span className="text-blue-300 text-sm">Try It Now</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Create Your First Short Link
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            No registration required. Create a short link instantly and see how it works.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnonymousLinkForm />
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-blue-900/20 rounded-full border border-blue-700/50 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle size={16} className="text-blue-400 mr-2" />
            <span className="text-blue-300 text-sm">Powerful Features</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need to manage your links
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional-grade URL shortening with enterprise features that scale with your business
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 hover:bg-gray-800/50 transition-all duration-300 relative overflow-hidden"
              variants={featureVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Gradient overlay on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                initial={false}
              />

              {/* Premium badge */}
              {feature.premium && (
                <motion.div
                  className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                  Premium
                </motion.div>
              )}

              <motion.div
                className={`w-14 h-14 ${feature.bgColor} backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 relative z-10 border border-gray-600/50`}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className={feature.iconColor} size={28} />
              </motion.div>

              <h3 className="text-xl font-semibold text-white mb-3 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-300 relative z-10 group-hover:text-gray-200 transition-colors leading-relaxed">
                {feature.description}
              </p>

              {/* Floating elements */}
              <motion.div
                className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full opacity-5`}
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

        {/* CTA Section */}
        <motion.div
          className="text-center mt-20"
          variants={itemVariants}
        >
          <motion.div
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-4xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to unlock all features?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Sign up for free to get password protection, link expiration, detailed analytics, and much more.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/auth/signin"
                className="bg-white text-black px-8 py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl inline-flex items-center group text-lg"
              >
                Create Free Account
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}