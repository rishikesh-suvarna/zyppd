/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AnalyticsView } from '@/components/AnalyticsView';

export default async function AnalyticsPage({ params }: any) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = params;

  const link = await prisma.link.findFirst({
    where: {
      id,
      userId: (session.user as { id: string }).id,
    },
    include: {
      domain: true,
    },
  });

  if (!link) {
    redirect('/dashboard');
  }
  const fixedLink = link
    ? {
      ...link,
      title: link.title === null ? undefined : link.title,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
      domain: link.domain ? { domain: link.domain.domain } : undefined,
    }
    : link;

  return <AnalyticsView link={fixedLink} />;
}