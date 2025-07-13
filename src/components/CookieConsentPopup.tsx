'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Check } from 'lucide-react';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentPopupProps {
  onConsentChange?: (consent: CookieConsent) => void;
  forceShow?: boolean;
}

export function CookieConsentPopup({ onConsentChange, forceShow }: CookieConsentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    } else {
      const existingConsent = localStorage.getItem('cookie-consent');
      if (!existingConsent) {
        // Show popup after a brief delay
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      } else {
        // Load existing consent
        try {
          const parsed = JSON.parse(existingConsent);
          setConsent(parsed);
          onConsentChange?.(parsed);
        } catch (e) {
          console.error('Error parsing cookie consent:', e);
        }
      }
    }
  }, [forceShow, onConsentChange]);

  const saveConsent = (consentData: CookieConsent) => {
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setConsent(consentData);
    onConsentChange?.(consentData);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveConsent(allConsent);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    saveConsent(necessaryOnly);
  };

  const handleCustomSave = () => {
    saveConsent(consent);
  };

  const handleToggleConsent = (type: keyof CookieConsent) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    setConsent(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookieConsent,
      title: 'Necessary Cookies',
      description: 'Required for the website to function properly. Cannot be disabled.',
      examples: 'Authentication, security, basic functionality',
      required: true,
    },
    {
      key: 'analytics' as keyof CookieConsent,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      examples: 'Google Analytics, usage statistics, performance monitoring',
      required: false,
    },
    {
      key: 'preferences' as keyof CookieConsent,
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences for a better experience.',
      examples: 'Language settings, theme preferences, dashboard layout',
      required: false,
    },
    {
      key: 'marketing' as keyof CookieConsent,
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites for advertising purposes.',
      examples: 'Social media tracking, advertising networks, retargeting',
      required: false,
    },
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Popup */}
        <motion.div
          className="relative w-full max-w-lg bg-black border border-gray-700 rounded-lg shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                  <Cookie size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
                  <p className="text-xs text-gray-400">Manage your privacy settings</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts.
                You can customize your preferences below.
              </p>

              {/* Quick Actions */}
              {!showDetails && (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 bg-white text-black py-2.5 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleAcceptNecessary}
                      className="flex-1 border border-gray-600 text-white py-2.5 px-4 rounded-lg font-medium hover:border-gray-500 hover:bg-gray-900 transition-colors"
                    >
                      Necessary Only
                    </button>
                  </div>

                  <button
                    onClick={() => setShowDetails(true)}
                    className="w-full flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm py-2"
                  >
                    <Settings size={16} className="mr-2" />
                    Customize Settings
                  </button>
                </motion.div>
              )}

              {/* Detailed Settings */}
              {showDetails && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {cookieTypes.map((type) => (
                      <div
                        key={type.key}
                        className="border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white flex items-center">
                              {type.title}
                              {type.required && (
                                <span className="ml-2 text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                                  Required
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              {type.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <strong>Examples:</strong> {type.examples}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleConsent(type.key)}
                            disabled={type.required}
                            className={`ml-3 w-10 h-6 rounded-full transition-colors relative ${consent[type.key]
                              ? 'bg-white'
                              : 'bg-gray-600'
                              } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full transition-transform absolute top-1 ${consent[type.key]
                                ? 'translate-x-5 bg-black'
                                : 'translate-x-1 bg-white'
                                }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Save Actions */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleCustomSave}
                      className="flex-1 bg-white text-black py-2.5 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      <Check size={16} className="mr-2" />
                      Save Preferences
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="border border-gray-600 text-white py-2.5 px-4 rounded-lg font-medium hover:border-gray-500 hover:bg-gray-900 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Privacy Policy Link */}
              <div className="text-center pt-2 border-t border-gray-800">
                <p className="text-xs text-gray-500">
                  Learn more in our{' '}
                  <a
                    href="/privacy-policy"
                    className="text-white hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to use cookie consent in other components
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  }, []);

  const hasConsent = (type: keyof CookieConsent): boolean => {
    return consent?.[type] ?? false;
  };

  const updateConsent = (newConsent: CookieConsent) => {
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
  };

  return {
    consent,
    hasConsent,
    updateConsent,
    hasProvidedConsent: !!consent,
  };
}