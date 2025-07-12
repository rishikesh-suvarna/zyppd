import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AnalyticsView } from '@/components/AnalyticsView';

interface Props {
  params: {
    id: string;
  };
}

export default async function AnalyticsPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const awaitedParams = await params;
  const { id } = awaitedParams;

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

  return <AnalyticsView link={link} />;
}