
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify domain ownership
    const domain = await prisma.domain.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain not found or access denied' },
        { status: 404 }
      );
    }

    // Check if domain is being used by any links
    const linksUsingDomain = await prisma.link.count({
      where: { domainId: params.id }
    });

    if (linksUsingDomain > 0) {
      return NextResponse.json(
        { error: `Cannot delete domain. ${linksUsingDomain} links are using this domain.` },
        { status: 400 }
      );
    }

    await prisma.domain.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Domain deleted successfully' });
  } catch (error) {
    console.error('Error deleting domain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}