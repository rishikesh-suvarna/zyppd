/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const link = await prisma.link.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const [analytics, totalClicks, recentClicks] = await Promise.all([
      prisma.analytics.findMany({
        where: { linkId: id },
        orderBy: { clickedAt: 'desc' },
        take: 100,
      }),
      prisma.analytics.count({ where: { linkId: id } }),
      prisma.analytics.count({
        where: {
          linkId: id,
          clickedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    // Group by country
    const countryStats = analytics.reduce((acc, click) => {
      const country = click.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by day for the last 30 days
    const dailyStats = analytics
      .filter(click => click.clickedAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((acc, click) => {
        const day = click.clickedAt.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return NextResponse.json({
      totalClicks,
      recentClicks,
      countryStats,
      dailyStats,
      recentAnalytics: analytics.slice(0, 20),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}