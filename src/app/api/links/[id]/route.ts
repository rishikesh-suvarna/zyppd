/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  context: { params: any }
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
        id,
        userId: userId,
      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    await prisma.link.delete({
      where: { id },
    });

    revalidatePath('/dashboard');

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}