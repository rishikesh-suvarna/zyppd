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

  const link = await prisma.link.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
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