/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Schema for authenticated users (full features)
const createLinkSchemaAuth = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
  domainId: z.string().optional(),
});

// Schema for anonymous users (limited features)
const createLinkSchemaAnon = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!(token && token.sub);

  try {
    const body = await request.json();
    console.log('Request body:', body); // Debug log

    // Use different validation schemas based on authentication status
    const validationResult = isAuthenticated
      ? createLinkSchemaAuth.safeParse(body)
      : createLinkSchemaAnon.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // For anonymous users, restrict certain features
    if (!isAuthenticated) {
      // Don't allow custom domains for anonymous users
      if ('domainId' in data) {
        return NextResponse.json(
          { error: 'Custom domains are only available for registered users' },
          { status: 403 }
        );
      }

      // Don't allow password protection for anonymous users
      if ('password' in data) {
        return NextResponse.json(
          { error: 'Password protection is only available for registered users' },
          { status: 403 }
        );
      }

      // Don't allow expiration dates for anonymous users
      if ('expiresAt' in data) {
        return NextResponse.json(
          { error: 'Link expiration is only available for registered users' },
          { status: 403 }
        );
      }
    }

    let expiresAtDate: Date | null = null;
    if (isAuthenticated && 'expiresAt' in data && data.expiresAt) {
      const parsed = new Date(String(data.expiresAt));
      if (!isNaN(parsed.getTime())) {
        expiresAtDate = parsed;
      } else {
        return NextResponse.json(
          { error: 'Invalid expiresAt format. Please provide a valid date/time.' },
          { status: 400 }
        );
      }
    }

    // Generate short code if not provided
    let shortCode = data.shortCode || nanoid(8);

    // Check if short code is already taken
    const existingLink = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (existingLink) {
      if (data.shortCode) {
        return NextResponse.json(
          { error: 'Short code already taken. Please choose a different one.' },
          { status: 400 }
        );
      }
      // Generate new code if auto-generated conflicts
      shortCode = nanoid(8);
    }

    // Hash password if provided (only for authenticated users)
    let hashedPassword = null;
    if (isAuthenticated && 'password' in data && typeof data.password === 'string' && data.password) {
      hashedPassword = await bcrypt.hash(data.password, 12);
    }

    // Validate domain ownership if specified (only for authenticated users)
    if (isAuthenticated && 'domainId' in data && data.domainId) {
      const domain = await prisma.domain.findFirst({
        where: {
          id: data.domainId,
          userId: token!.sub!,
          isActive: true,
        },
      });

      if (!domain) {
        return NextResponse.json(
          { error: 'Invalid domain or you do not have permission to use it' },
          { status: 400 }
        );
      }
    }

    // Create the link
    const linkData: any = {
      originalUrl: data.originalUrl,
      shortCode,
      title: data.title,
      description: data.description,
      password: hashedPassword,
      expiresAt: expiresAtDate,
    };

    // Only set userId and domainId for authenticated users
    if (isAuthenticated) {
      linkData.userId = token!.sub!;
      if ('domainId' in data) {
        linkData.domainId = data.domainId;
      }
    }

    const link = await prisma.link.create({
      data: linkData,
      include: {
        domain: true,
        _count: {
          select: { analytics: true },
        },
      },
    });

    const response = {
      id: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      title: link.title,
      description: link.description,
      expiresAt: link.expiresAt,
      isActive: link.isActive,
      createdAt: link.createdAt,
      domain: link.domain,
      clicks: link._count.analytics,
      shortUrl: link.domain
        ? `https://${link.domain.domain}/${link.shortCode}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`,
      isAnonymous: !isAuthenticated,
    };

    console.log('Created link:', response); // Debug log

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);

    // Handle specific Prisma errors
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Short code already exists. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.sub) {
    return NextResponse.json(
      { error: 'You must be signed in to view links' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const where = {
      userId: token.sub,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { originalUrl: { contains: search, mode: 'insensitive' as const } },
          { shortCode: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where,
        include: {
          domain: true,
          _count: {
            select: { analytics: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.link.count({ where }),
    ]);

    const formattedLinks = links.map(link => ({
      id: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      title: link.title,
      description: link.description,
      expiresAt: link.expiresAt,
      isActive: link.isActive,
      createdAt: link.createdAt,
      domain: link.domain,
      clicks: link._count.analytics,
      shortUrl: link.domain
        ? `https://${link.domain.domain}/${link.shortCode}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`,
    }));

    return NextResponse.json({
      links: formattedLinks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}