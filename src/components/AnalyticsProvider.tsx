/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AnalyticsProvider.tsx
'use client';

import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useCookieConsent } from './CookieProvider';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function AnalyticsProvider() {
  const { hasConsent, hasProvidedConsent } = useCookieConsent();

  useEffect(() => {
    // Only initialize analytics after user has provided consent
    if (!hasProvidedConsent) return;

    if (hasConsent('analytics')) {
      initializeGoogleAnalytics();
    } else {
      removeGoogleAnalytics();
    }
  }, [hasConsent, hasProvidedConsent]);

  const initializeGoogleAnalytics = () => {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-45E93S9FW7';

    // Check if already initialized
    if (document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) {
      return;
    }

    // Load GA script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize GA
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    console.log('Google Analytics initialized');
  };

  const removeGoogleAnalytics = () => {
    // Disable GA tracking
    if (typeof window !== 'undefined' && window.gtag) {
      const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-45E93S9FW7';
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false,
        anonymize_ip: true
      });
    }

    // Remove GA cookies
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });

    console.log('Google Analytics disabled and cookies cleared');
  };

  return (
    <>
      {/* Vercel Analytics - only render if user consents to analytics */}
      {hasProvidedConsent && hasConsent('analytics') && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}

// Hook for tracking events with consent check
export function useAnalytics() {
  const { hasConsent } = useCookieConsent();

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (!hasConsent('analytics')) return;

    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        // Add common properties
        timestamp: new Date().toISOString(),
      });
    }

    // You can also add other analytics services here
    console.log('Event tracked:', eventName, parameters);
  };

  const trackPageView = (url?: string) => {
    if (!hasConsent('analytics')) return;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-45E93S9FW7', {
        page_path: url || window.location.pathname,
      });
    }
  };

  const trackLinkCreation = (linkData: {
    hasCustomCode?: boolean;
    hasPassword?: boolean;
    hasExpiration?: boolean;
    isAnonymous?: boolean;
  }) => {
    trackEvent('link_created', {
      event_category: 'engagement',
      has_custom_code: linkData.hasCustomCode,
      has_password: linkData.hasPassword,
      has_expiration: linkData.hasExpiration,
      is_anonymous: linkData.isAnonymous,
    });
  };

  const trackLinkClick = (linkId: string, referrer?: string) => {
    trackEvent('link_clicked', {
      event_category: 'engagement',
      link_id: linkId,
      referrer: referrer,
    });
  };

  const trackUserSignup = (provider: string) => {
    trackEvent('sign_up', {
      event_category: 'conversion',
      method: provider,
    });
  };

  const trackUserSignin = (provider: string) => {
    trackEvent('login', {
      event_category: 'engagement',
      method: provider,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackLinkCreation,
    trackLinkClick,
    trackUserSignup,
    trackUserSignin,
    isAnalyticsEnabled: hasConsent('analytics'),
  };
}