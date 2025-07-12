'use client';

import Link from 'next/link';
import { Link2, BarChart3, Shield, Clock, Globe, Zap, ArrowRight, Sparkles, Star, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
      gradient: "from-purple-500 to-violet-500"
    },
    {
      icon: Clock,
      title: "Link Expiration",
      description: "Set expiration dates for your links to automatically disable them after a certain time.",
      bgColor: "bg-orange-900/50",
      iconColor: "text-orange-400",
      gradient: "from-orange-500 to-red-500"
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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow",
      content: "Zyppd has revolutionized our link management. The analytics are incredible!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Marcus Johnson",
      role: "Growth Lead",
      company: "StartupXYZ",
      content: "Custom domains and password protection are game-changers for our campaigns.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Content Manager",
      company: "CreativeAgency",
      content: "The best URL shortener we've used. Clean, fast, and feature-rich.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
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
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
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
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl inline-flex items-center group text-lg"
              >
                Get Started Free
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#features"
                className="border border-gray-600 text-gray-200 px-8 py-4 rounded-xl hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200 font-semibold backdrop-blur-sm text-lg"
              >
                See Features
              </Link>
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
      </motion.div>

      {/* Testimonials */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-green-900/20 rounded-full border border-green-700/50 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Users size={16} className="text-green-400 mr-2" />
            <span className="text-green-300 text-sm">Loved by Teams</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by professionals worldwide
          </h2>
          <p className="text-xl text-gray-300">
            See what our users have to say about Zyppd
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">&quot;{testimonial.content}&quot;</p>
              <div className="flex items-center">
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-20 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        style={{ backgroundSize: "200% 200%" }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            className="text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            Ready to transform your links?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join thousands of professionals who trust Zyppd for their URL shortening needs.
            Start free, upgrade when you&apos;re ready.
          </motion.p>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth/signin"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-semibold inline-flex items-center shadow-lg hover:shadow-xl group text-lg"
            >
              Start Free Today
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/10 rounded-full"
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
    </div>
  );
}