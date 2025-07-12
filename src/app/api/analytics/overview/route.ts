/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type SessionWithId = {
  user?: SessionUser;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as SessionWithId;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's links
    const userLinks = await prisma.link.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { analytics: true }
        }
      }
    }) as Array<{
      id: string;
      shortCode: string;
      title: string;
      originalUrl: string;
      isActive: boolean;
      _count: { analytics: number };
    }>;

    // Calculate date ranges
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total clicks for all user's links
    const totalClicks = await prisma.analytics.count({
      where: {
        link: {
          userId: session.user.id
        }
      }
    });

    // Get clicks this week
    const clicksThisWeek = await prisma.analytics.count({
      where: {
        link: {
          userId: session.user.id
        },
        clickedAt: {
          gte: weekAgo
        }
      }
    });

    // Get clicks this month
    const clicksThisMonth = await prisma.analytics.count({
      where: {
        link: {
          userId: session.user.id
        },
        clickedAt: {
          gte: monthAgo
        }
      }
    });

    // Get top performing links
    const topLinks = userLinks
      .map((link) => ({
        id: link.id,
        shortCode: link.shortCode,
        title: link.title,
        originalUrl: link.originalUrl,
        clicks: link._count.analytics
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Get recent activity
    const recentActivity = await prisma.analytics.findMany({
      where: {
        link: {
          userId: session.user.id
        }
      },
      include: {
        link: {
          select: {
            id: true,
            shortCode: true,
            title: true
          }
        }
      },
      orderBy: {
        clickedAt: 'desc'
      },
      take: 20
    });

    // Get daily stats for the last 30 days
    const dailyStats = await prisma.analytics.findMany({
      where: {
        link: {
          userId: session.user.id
        },
        clickedAt: {
          gte: monthAgo
        }
      },
      select: {
        clickedAt: true
      }
    });

    // Group by day
    const dailyStatsGrouped = dailyStats.reduce(
      (acc: Record<string, number>, click: { clickedAt: Date }) => {
        const day = click.clickedAt.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get country stats
    const countryStats = await prisma.analytics.findMany({
      where: {
        link: {
          userId: session.user.id
        }
      },
      select: {
        country: true
      }
    });

    const countryStatsGrouped = countryStats.reduce((acc, click) => {
      const country = click.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const response = {
      totalLinks: userLinks.length,
      totalClicks,
      activeLinks: userLinks.filter(link => link.isActive).length,
      clicksThisWeek,
      clicksThisMonth,
      topLinks,
      recentActivity: recentActivity.map(activity => ({
        linkId: activity.link.id,
        shortCode: activity.link.shortCode,
        title: activity.link.title,
        clickedAt: activity.clickedAt.toISOString(),
        country: activity.country
      })),
      dailyStats: dailyStatsGrouped,
      countryStats: countryStatsGrouped
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}