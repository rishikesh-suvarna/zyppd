/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Shield, BarChart3, Crown, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import { SegmentedCountdown, DigitalCountdown, MorphingCountdown, PulseCountdown } from './Countdown';

interface InterstitialPageProps {
  originalUrl: string;
  shortCode: string;
  title?: string;
  description?: string;
  linkId: string;
}

export function InterstitialPage({
  originalUrl,
  shortCode,
  title,
  description,
  linkId
}: InterstitialPageProps) {
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          // Track the redirect
          if (typeof window !== 'undefined') {
            // Send analytics if user has consented
            fetch('/api/analytics/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                linkId,
                eventType: 'redirect',
                timestamp: new Date().toISOString()
              })
            }).catch(console.error);
          }

          // Redirect after a brief delay
          setTimeout(() => {
            window.location.href = originalUrl;
          }, 500);

          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [originalUrl, linkId]);

  const handleSkip = () => {
    setIsRedirecting(true);
    setCountdown(0);

    // Track skip action
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId,
          eventType: 'skip',
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    }

    window.location.href = originalUrl;
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} | Zyppd.cc` : 'Zyppd.cc - Short Link'}</title>
        <meta name="description" content={description || "Create custom short links with analytics, password protection, and custom domains. Powered by Zyppd.cc"} />
        <meta property="og:title" content={title ? `${title} | Zyppd.cc` : 'Zyppd.cc - Short Link'} />
        <meta property="og:description" content={description || "Create custom short links with analytics, password protection, and custom domains. Powered by Zyppd.cc"} />
        <meta property="og:url" content={`https://www.zyppd.cc/${shortCode}`} />
        <meta property="og:image" content="https://www.zyppd.cc/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title ? `${title} | Zyppd.cc` : 'Zyppd.cc - Short Link'} />
        <meta name="twitter:description" content={description || "Create custom short links with analytics, password protection, and custom domains. Powered by Zyppd.cc"} />
        <meta name="twitter:image" content="https://www.zyppd.cc/og-image.png" />
        <meta name="twitter:site" content="@zyppd" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.zyppd.cc/${shortCode}`} />
      </Head>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          className="max-w-lg w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Redirect Card */}
          <motion.div
            className="border border-gray-700 rounded-lg p-8 mb-6 text-center"
            variants={itemVariants}
          >
            {/* Countdown */}
            <MorphingCountdown
              countdown={countdown}
              isRedirecting={isRedirecting}
            />


            {/* Redirect Info */}
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl font-bold text-white mb-2">
                {isRedirecting ? 'Redirecting...' : 'Preparing your link'}
              </h1>
              <p className="text-gray-400 mb-4">
                {isRedirecting
                  ? 'Taking you to your destination'
                  : `Redirecting in ${countdown} second${countdown !== 1 ? 's' : ''}`
                }
              </p>
            </motion.div>

            {/* Link Info */}
            <motion.div
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Going to:</span>
                <ExternalLink size={16} className="text-gray-400" />
              </div>
              {title && (
                <div className="text-gray-300 text-start text-sm mt-1">{title}</div>
              )}
              {description && (
                <div className="text-gray-400 text-start text-xs mt-1">{description}</div>
              )}
              <div className="text-white text-start font-medium break-all">
                {getDomain(originalUrl)}
              </div>
            </motion.div>

            {/* Skip Button */}
            <motion.button
              onClick={handleSkip}
              disabled={isRedirecting}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRedirecting ? 'Redirecting...' : 'Skip Wait'}
            </motion.button>
          </motion.div>

          {/* Promotional Card */}
          <motion.div
            className="border border-gray-700 rounded-lg p-6"
            variants={itemVariants}
          >
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <Crown size={20} className="text-yellow-400 mr-2" />
                <span className="text-white font-semibold">Powered by Zyppd.cc</span>
              </div>
              <p className="text-gray-400 text-sm">
                Create your own custom short links with analytics
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <BarChart3 size={16} className="text-white" />
                </div>
                <span className="text-gray-300 text-xs">Analytics</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="text-gray-300 text-xs">Security</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Clock size={16} className="text-white" />
                </div>
                <span className="text-gray-300 text-xs">Fast</span>
              </div>
            </div>

            <Link
              href="/"
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center font-medium flex items-center justify-center"
            >
              Try Zyppd.cc Free
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>

          {/* Security Notice */}
        </motion.div>
      </div>
    </>
  );
}