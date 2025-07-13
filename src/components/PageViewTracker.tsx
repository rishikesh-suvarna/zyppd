// components/PageViewTracker.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/components/AnalyticsProvider';
import { useCookieConsent } from '@/components/CookieProvider';

export function PageViewTracker() {
  const { trackPageView, isAnalyticsEnabled } = useAnalytics();
  const { hasProvidedConsent } = useCookieConsent();
  const pathname = usePathname();

  useEffect(() => {
    // Only track if user has provided consent AND enabled analytics
    if (hasProvidedConsent && isAnalyticsEnabled) {
      trackPageView(pathname);
    }
  }, [pathname, trackPageView, hasProvidedConsent, isAnalyticsEnabled]);

  // Optional: Show analytics status in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Status:', {
        hasProvidedConsent,
        isAnalyticsEnabled,
        currentPath: pathname,
        willTrack: hasProvidedConsent && isAnalyticsEnabled
      });
    }
  }, [hasProvidedConsent, isAnalyticsEnabled, pathname]);

  return null;
}

// Alternative: Conditional Page View Tracker
export function ConditionalPageViewTracker() {
  const { trackPageView } = useAnalytics();
  const { hasConsent, hasProvidedConsent } = useCookieConsent();
  const pathname = usePathname();

  useEffect(() => {
    // Only set up tracking after user has made a choice
    if (!hasProvidedConsent) return;

    // Only track if analytics consent is given
    if (hasConsent('analytics')) {
      trackPageView(pathname);
    } else {
      console.log('Page view not tracked - analytics consent not given');
    }
  }, [pathname, trackPageView, hasConsent, hasProvidedConsent]);

  return null;
}

// Enhanced version with retry mechanism
export function SmartPageViewTracker() {
  const { trackPageView, isAnalyticsEnabled } = useAnalytics();
  const { hasProvidedConsent, consent } = useCookieConsent();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for consent decision
    if (!hasProvidedConsent) {
      console.log('Waiting for user consent decision...');
      return;
    }

    // Track immediately if analytics enabled
    if (isAnalyticsEnabled) {
      trackPageView(pathname);
      console.log(`Page view tracked: ${pathname}`);
    } else {
      console.log(`Page view not tracked: ${pathname} (analytics disabled)`);
    }
  }, [pathname, trackPageView, hasProvidedConsent, isAnalyticsEnabled]);

  // Track when consent changes (user enables analytics later)
  useEffect(() => {
    if (hasProvidedConsent && isAnalyticsEnabled) {
      // Send a page view for current page when analytics is newly enabled
      trackPageView(pathname);
      console.log(`Analytics enabled - tracking current page: ${pathname}`);
    }
  }, [consent?.analytics, pathname, trackPageView, hasProvidedConsent, isAnalyticsEnabled]);

  return null;
}

// Debug component to show tracking status (useful during development)
export function AnalyticsDebugInfo() {
  const { isAnalyticsEnabled } = useAnalytics();
  const { hasProvidedConsent } = useCookieConsent();
  const pathname = usePathname();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-600 rounded-lg p-3 text-xs text-white z-50">
      <h4 className="font-semibold mb-2">Analytics Debug</h4>
      <div className="space-y-1">
        <div>Consent Given: {hasProvidedConsent ? '✅' : '❌'}</div>
        <div>Analytics: {isAnalyticsEnabled ? '✅' : '❌'}</div>
        <div>Current Page: {pathname}</div>
        <div>Will Track: {hasProvidedConsent && isAnalyticsEnabled ? '✅' : '❌'}</div>
      </div>
    </div>
  );
}