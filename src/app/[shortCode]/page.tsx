/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { PasswordForm } from '@/components/PasswordForm';
import { NotFoundPage } from '@/components/NotFoundPage';
import { ExpiredPage } from '@/components/ExpiredPage';
import { InterstitialPage } from '@/components/InterstitialPage';

interface RedirectPageProps {
  params: { shortCode: string };
  searchParams: { password?: string; direct?: string };
}

export default async function RedirectPage({ params, searchParams }: RedirectPageProps) {
  const { shortCode } = params;
  const headersList = headers();
  const userAgent = (await headersList).get('user-agent') || '';
  const referer = (await headersList).get('referer') || '';
  const forwardedFor = (await headersList).get('x-forwarded-for') || '';
  const realIp = (await headersList).get('x-real-ip') || '';
  const ipAddress = forwardedFor.split(',')[0] || realIp || '';

  // Find the link
  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: {
      domain: true,
      user: {
        select: {
          tier: true
        }
      }
    },
  });

  if (!link || !link.isActive) {
    return <NotFoundPage />;
  }

  // Check if link has expired
  if (link.expiresAt && new Date() > link.expiresAt) {
    return <ExpiredPage />;
  }

  // Check if password is required
  if (link.password) {
    const providedPassword = searchParams.password;

    if (!providedPassword) {
      return <PasswordForm shortCode={shortCode} />;
    }

    const isPasswordValid = await bcrypt.compare(providedPassword, link.password);
    if (!isPasswordValid) {
      return <PasswordForm shortCode={shortCode} error="Invalid password" />;
    }
  }

  // Track the click
  try {
    await prisma.analytics.create({
      data: {
        linkId: link.id,
        ipAddress,
        userAgent,
        referer,
        country: null,
        city: null,
      },
    });
  } catch (error) {
    console.error('Error tracking click:', error);
  }

  // Check if should show interstitial or direct redirect
  const shouldShowInterstitial = () => {
    // Skip interstitial if direct parameter is present (for premium users)
    if (searchParams.direct === 'true') return false;

    // Skip for premium users (if you want to offer this as a perk)
    if (link.user?.tier === 'PREMIUM') return false;

    // Skip for bots/crawlers
    const botUserAgents = ['bot', 'crawler', 'spider', 'scraper'];
    const isBot = botUserAgents.some(bot =>
      userAgent.toLowerCase().includes(bot)
    );
    if (isBot) return false;

    // Show interstitial by default
    return true;
  };

  // Direct redirect for special cases
  if (!shouldShowInterstitial()) {
    redirect(link.originalUrl);
  }

  // Show interstitial page
  return (
    <InterstitialPage
      originalUrl={link.originalUrl}
      shortCode={shortCode}
      title={link.title ?? undefined}
      description={link.description ?? undefined}
      linkId={link.id}
    />
  );
}