'use client';

import { motion } from 'framer-motion';

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgGradient?: string;
}

export function AnalyticsCard({ title, value, icon, bgGradient = "from-blue-500 to-purple-500" }: AnalyticsCardProps) {
  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 relative overflow-hidden group"
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        initial={false}
      />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <motion.p
            className="text-3xl font-bold text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {value.toLocaleString()}
          </motion.p>
        </div>

        <motion.div
          className={`w-12 h-12 bg-gradient-to-br ${bgGradient} rounded-lg flex items-center justify-center shadow-lg`}
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Subtle animation elements */}
      <motion.div
        className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${bgGradient} rounded-full opacity-5`}
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
  );
}