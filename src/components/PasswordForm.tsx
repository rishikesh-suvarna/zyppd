'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasswordFormProps {
  shortCode: string;
  error?: string;
}

export function PasswordForm({ shortCode, error }: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Redirect with password as query parameter
    const url = `/${shortCode}?password=${encodeURIComponent(password)}`;
    router.push(url);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg relative">
              <Shield size={32} className="text-white" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-white mb-2"
            variants={itemVariants}
          >
            Protected Link
          </motion.h2>

          <motion.p
            className="text-gray-300"
            variants={itemVariants}
          >
            This link is password protected. Please enter the password to continue.
          </motion.p>
        </motion.div>

        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {error && (
            <motion.div
              className="bg-red-900/50 border border-red-700 rounded-lg p-4 backdrop-blur-sm flex items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={20} className="text-red-400 mr-3" />
              <div className="text-red-200 text-sm">{error}</div>
            </motion.div>
          )}

          <motion.div className="relative" variants={itemVariants}>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full pl-12 pr-12 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <motion.button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading || !password.trim()}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <motion.div className="flex items-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                  Verifying...
                </motion.div>
              ) : (
                <span className="flex items-center">
                  <Lock size={16} className="mr-2" />
                  Access Link
                </span>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Security Info */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-start space-x-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Shield size={20} className="text-blue-400 mt-0.5" />
            </motion.div>
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Secure Access</h3>
              <p className="text-xs text-gray-400">
                This link has been protected by its creator to ensure only authorized users can access the content.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}