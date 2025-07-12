/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { PasswordForm } from '@/components/PasswordForm';
import { NotFoundPage } from '@/components/NotFoundPage';
import { ExpiredPage } from '@/components/ExpiredPage';

export default async function RedirectPage({ params, searchParams }: any) {
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
    include: { domain: true },
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
        // Note: You'd integrate with a geo IP service here
        country: null,
        city: null,
      },
    });
  } catch (error) {
    console.error('Error tracking click:', error);
  }

  // Redirect to the original URL
  redirect(link.originalUrl);
}