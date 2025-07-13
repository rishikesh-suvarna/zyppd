'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CookieConsentPopup } from './CookieConsentPopup';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieContextType {
  consent: CookieConsent | null;
  hasConsent: (type: keyof CookieConsent) => boolean;
  updateConsent: (consent: CookieConsent) => void;
  hasProvidedConsent: boolean;
  showCookieSettings: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

interface CookieProviderProps {
  children: ReactNode;
}

export function CookieProvider({ children }: CookieProviderProps) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Load existing consent on mount
    const stored = localStorage.getItem('cookie-consent');
    if (stored) {
      try {
        const parsedConsent = JSON.parse(stored);
        setConsent(parsedConsent);

        // Initialize analytics if user has consented
        if (parsedConsent.analytics) {
          initializeAnalytics();
        }
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    } else {
      // Show popup if no consent exists
      setShowPopup(true);
    }
  }, []);

  const initializeAnalytics = () => {
    // Initialize Google Analytics if consent is given
    if (typeof window !== 'undefined' && consent?.analytics) {
      // Example: Initialize GA4
      // gtag('config', 'GA_MEASUREMENT_ID');
      console.log('Analytics initialized');
    }
  };

  const removeAnalytics = () => {
    // Remove analytics tracking when consent is withdrawn
    if (typeof window !== 'undefined') {
      // Example: Disable GA4 tracking
      // gtag('config', 'GA_MEASUREMENT_ID', { 'anonymize_ip': true });
      console.log('Analytics disabled');
    }
  };

  const hasConsent = (type: keyof CookieConsent): boolean => {
    return consent?.[type] ?? false;
  };

  const updateConsent = (newConsent: CookieConsent) => {
    const previousConsent = consent;
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());

    // Handle analytics based on consent changes
    if (newConsent.analytics && !previousConsent?.analytics) {
      initializeAnalytics();
    } else if (!newConsent.analytics && previousConsent?.analytics) {
      removeAnalytics();
    }

    // Hide popup after consent is saved
    setShowPopup(false);
  };

  const showCookieSettings = () => {
    setShowPopup(true);
  };

  const contextValue: CookieContextType = {
    consent,
    hasConsent,
    updateConsent,
    hasProvidedConsent: !!consent,
    showCookieSettings,
  };

  return (
    <CookieContext.Provider value={contextValue}>
      {children}
      {showPopup && (
        <CookieConsentPopup
          forceShow={showPopup}
          onConsentChange={updateConsent}
        />
      )}
    </CookieContext.Provider>
  );
}

// Hook to use cookie context
export function useCookieConsent() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
}

// Component to conditionally render analytics scripts
export function AnalyticsScripts() {
  const { hasConsent } = useCookieConsent();

  useEffect(() => {
    if (hasConsent('analytics')) {
      // Load Google Analytics
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure'
        });
      `;
      document.head.appendChild(script2);

      return () => {
        document.head.removeChild(script1);
        document.head.removeChild(script2);
      };
    }
  }, [hasConsent]);

  return null;
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  const { showCookieSettings, hasProvidedConsent } = useCookieConsent();

  if (!hasProvidedConsent) return null;

  return (
    <button
      onClick={showCookieSettings}
      className={`text-gray-200 hover:text-white transition-colors cursor-pointer text-sm ${className}`}
    >
      Cookie Settings
    </button>
  );
}