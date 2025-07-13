import { motion } from 'framer-motion';
import Link from 'next/link';
import { CookieSettingsButton } from './CookieProvider';

export default function Footer() {

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div
      className="mt-12 text-center border-t border-gray-800 py-4"
      variants={itemVariants}
    >
      <div className="space-x-4">
        <Link href="/terms-of-service" className="text-gray-200 hover:text-white transition-colors text-sm">
          Terms of Service
        </Link>
        <span className="text-gray-600">•</span>
        <Link href="/privacy-policy" className="text-gray-200 hover:text-white transition-colors text-sm">
          Privacy Policy
        </Link>
        <span className="text-gray-600">•</span>
        <CookieSettingsButton />
      </div>
    </motion.div>
  )
}