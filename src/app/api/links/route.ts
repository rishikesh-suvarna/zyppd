/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const createLinkSchema = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  password: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  domainId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.sub) {
    return NextResponse.json(
      { error: 'You must be signed in to create links' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    console.log('Request body:', body); // Debug log

    // Validate input data
    const validationResult = createLinkSchema.safeParse(body);
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

    // Hash password if provided
    let hashedPassword = null;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 12);
    }

    // Validate domain ownership if specified
    if (data.domainId) {
      const domain = await prisma.domain.findFirst({
        where: {
          id: data.domainId,
          userId: token.sub,
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
    const link = await prisma.link.create({
      data: {
        originalUrl: data.originalUrl,
        shortCode,
        title: data.title,
        description: data.description,
        password: hashedPassword,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        userId: token.sub,
        domainId: data.domainId,
      },
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