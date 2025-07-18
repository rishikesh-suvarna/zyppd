import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminAnalytics } from '@/components/AdminAnalytics';

// Define proper types for the data structures
interface AdminAnalyticsData {
  summary: {
    totalUsers: number;
    totalLinks: number;
    totalClicks: number;
    activeLinks: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    usersThisWeek: number;
    usersThisMonth: number;
    clickRate: string;
    activeRate: string;
  };
  topLinks: Array<{
    id: string;
    shortCode: string;
    title: string;
    originalUrl: string;
    clicks: number;
    userName: string;
    createdAt: string;
  }>;
  mostActiveUsers: Array<{
    id: string;
    name: string;
    email: string | null;
    linksCount: number;
    createdAt: string;
    isAdmin: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    linkId: string;
    shortCode: string;
    title: string;
    userName: string;
    clickedAt: string;
    country: string;
    userAgent?: string | null;
    referrer?: string | null;
  }>;
  dailyStats: {
    clicks: Record<string, number>;
    users: Record<string, number>;
    links: Record<string, number>;
  };
  countryStats: Record<string, number>;
  userGrowth: Record<string, number>;
  linkTrends: Record<string, number>;
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <div className="text-white p-8">Unauthorized</div>;

  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  });
  if (!adminUser?.isAdmin) return <div className="text-white p-8">Forbidden</div>;

  try {
    // Get comprehensive analytics data
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Basic counts
    const [totalUsers, totalLinks, totalClicks, activeLinks] = await Promise.all([
      prisma.user.count(),
      prisma.link.count(),
      prisma.analytics.count(),
      prisma.link.count({ where: { isActive: true } })
    ]);

    // Time-based analytics
    const [clicksThisWeek, clicksThisMonth, usersThisWeek, usersThisMonth] = await Promise.all([
      prisma.analytics.count({
        where: { clickedAt: { gte: weekAgo } }
      }),
      prisma.analytics.count({
        where: { clickedAt: { gte: monthAgo } }
      }),
      prisma.user.count({
        where: { createdAt: { gte: weekAgo } }
      }),
      prisma.user.count({
        where: { createdAt: { gte: monthAgo } }
      })
    ]);

    // Top performing links across all users
    const topLinksRaw = await prisma.link.findMany({
      include: {
        _count: { select: { analytics: true } },
        user: { select: { name: true, email: true } }
      },
      orderBy: {
        analytics: { _count: 'desc' }
      },
      take: 10
    });

    // Most active users by link count
    const mostActiveUsersRaw = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            links: true
          }
        }
      },
      orderBy: {
        links: { _count: 'desc' }
      },
      take: 10
    });

    // Recent activity across all users
    const recentActivityRaw = await prisma.analytics.findMany({
      include: {
        link: {
          select: {
            id: true,
            shortCode: true,
            title: true,
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { clickedAt: 'desc' },
      take: 50
    });

    // Daily stats for the last 30 days
    const dailyClicks = await prisma.analytics.findMany({
      where: { clickedAt: { gte: monthAgo } },
      select: { clickedAt: true }
    });

    const dailyUsers = await prisma.user.findMany({
      where: { createdAt: { gte: monthAgo } },
      select: { createdAt: true }
    });

    const dailyLinks = await prisma.link.findMany({
      where: { createdAt: { gte: monthAgo } },
      select: { createdAt: true }
    });

    // Country statistics
    const countryStatsRaw = await prisma.analytics.findMany({
      select: { country: true }
    });

    // User growth over time
    const userGrowthRaw = await prisma.user.findMany({
      where: { createdAt: { gte: yearAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Link creation trends
    const linkTrendsRaw = await prisma.link.findMany({
      where: { createdAt: { gte: yearAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Process data for charts with proper type safety
    const processedData: AdminAnalyticsData = {
      summary: {
        totalUsers,
        totalLinks,
        totalClicks,
        activeLinks,
        clicksThisWeek,
        clicksThisMonth,
        usersThisWeek,
        usersThisMonth,
        clickRate: totalLinks > 0 ? ((totalClicks / totalLinks) * 100).toFixed(1) : '0',
        activeRate: totalLinks > 0 ? ((activeLinks / totalLinks) * 100).toFixed(1) : '0'
      },
      topLinks: topLinksRaw.map(link => ({
        id: link.id,
        shortCode: link.shortCode,
        title: link.title || 'Untitled',
        originalUrl: link.originalUrl,
        clicks: link._count.analytics,
        userName: link.user ? link.user.name || link.user.email || 'Unknown User' : 'Unknown User',
        createdAt: link.createdAt.toISOString()
      })),
      mostActiveUsers: mostActiveUsersRaw.map(user => ({
        id: user.id,
        name: user.name || user.email || 'Unknown',
        email: user.email ? user.email : '',
        linksCount: user._count.links,
        createdAt: user.createdAt.toISOString(),
        isAdmin: user.isAdmin
      })),
      recentActivity: recentActivityRaw.map(activity => ({
        id: activity.id,
        linkId: activity.link.id,
        shortCode: activity.link.shortCode,
        title: activity.link.title || 'Untitled',
        userName: activity.link.user ? (activity.link.user.name || activity.link.user.email || 'Unknown') : 'Unknown',
        clickedAt: activity.clickedAt.toISOString(),
        country: activity.country || 'Unknown',
        userAgent: activity.userAgent,
        referrer: activity.referer
      })),
      dailyStats: {
        clicks: dailyClicks.reduce((acc: Record<string, number>, click) => {
          const day = click.clickedAt.toISOString().split('T')[0];
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {}),
        users: dailyUsers.reduce((acc: Record<string, number>, user) => {
          const day = user.createdAt.toISOString().split('T')[0];
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {}),
        links: dailyLinks.reduce((acc: Record<string, number>, link) => {
          const day = link.createdAt.toISOString().split('T')[0];
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {})
      },
      countryStats: countryStatsRaw.reduce((acc: Record<string, number>, click) => {
        const country = click.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {}),
      userGrowth: userGrowthRaw.reduce((acc: Record<string, number>, user) => {
        const month = user.createdAt.toISOString().substring(0, 7); // YYYY-MM format
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {}),
      linkTrends: linkTrendsRaw.reduce((acc: Record<string, number>, link) => {
        const month = link.createdAt.toISOString().substring(0, 7); // YYYY-MM format
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {})
    };

    return (
      <div className="min-h-screen bg-black">
        <AdminAnalytics data={processedData} />
      </div>
    );
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-400">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }
}