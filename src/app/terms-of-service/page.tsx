'use client';

import { parseDate } from '@/utils/parseDate';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
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

  const updatedDate = new Date(`2025-07-13`);

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
                <Scale size={24} className="text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                <p className="text-gray-400 mt-1">Last updated: {parseDate(updatedDate, true)}</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div className="prose prose-invert max-w-none" variants={itemVariants}>
            <div className="border border-gray-800 rounded-lg p-8 space-y-8">

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing or using Zyppd.cc (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                <p className="text-gray-300 leading-relaxed">
                  Zyppd.cc is a URL shortening service that allows users to create shortened versions of long URLs.
                  We also provide analytics, link management, and other related features.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">3.1 Account Creation</h3>
                    <ul className="text-gray-300 space-y-2 list-disc list-inside">
                      <li>You may use our basic services without creating an account</li>
                      <li>To access premium features, you must create an account with accurate information</li>
                      <li>You are responsible for safeguarding your account credentials</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">3.2 Account Responsibility</h3>
                    <ul className="text-gray-300 space-y-2 list-disc list-inside">
                      <li>You are responsible for all activities under your account</li>
                      <li>You must notify us immediately of any unauthorized use</li>
                      <li>You must be at least 13 years old to create an account</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Permitted Uses
                    </h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Shorten legitimate URLs</li>
                      <li>• Track analytics for your links</li>
                      <li>• Manage your shortened URLs</li>
                    </ul>
                  </div>
                  <div className="border border-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Prohibited Uses
                    </h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Link to illegal content</li>
                      <li>• Distribute malware or viruses</li>
                      <li>• Engage in phishing activities</li>
                      <li>• Distribute spam</li>
                      <li>• Infringe intellectual property</li>
                      <li>• Harassment or hate speech</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Service Availability</h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    We strive for 99.9% uptime but make no guarantees. Service may be temporarily unavailable
                    for maintenance or other reasons. We reserve the right to modify or discontinue features
                    at any time with reasonable notice.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Privacy and Data</h2>
                <p className="text-gray-300 leading-relaxed">
                  We collect and use data as described in our <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
                  Analytics data helps us improve our service. We do not sell personal data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Termination</h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    You may delete your account at any time. We may suspend or terminate accounts for violations
                    of these terms. Severe violations may result in immediate termination.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    <strong className="text-white">Important:</strong> Our service is provided &quot;as is&quot; without warranties.
                    Our liability is limited to the maximum extent permitted by law. We are not liable for indirect,
                    incidental, or consequential damages.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update these Terms of Service at any time. We will notify users of material changes
                  via email or service notifications. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">10. Contact Information</h2>
                <div className="border border-gray-800 rounded-lg p-4">
                  <p className="text-gray-300 mb-3">
                    For questions about these Terms of Service, contact us at:
                  </p>
                  <div className="space-y-1 text-sm">
                    <Link href={`mailto:support@zyppd.cc`} className="text-white"><strong>Email:</strong> support@zyppd.cc</Link>
                    {/* <p className="text-white"><strong>Website:</strong> https://www.zyppd.cc/contact</p> */}
                  </div>
                </div>
              </section>

            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-12 text-center border-t border-gray-800 pt-8"
            variants={itemVariants}
          >
            <p className="text-gray-500 text-sm">
              These terms were last updated on {parseDate(updatedDate, true)}. Please review them periodically for changes.
            </p>
            <div className="mt-4 space-x-4">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              {/* <span className="text-gray-600">•</span>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link> */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}