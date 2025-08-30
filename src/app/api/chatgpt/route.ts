import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const pinned = searchParams.get('pinned');

    const chats = await prisma.chatgptChat.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(pinned === 'true' && { isPinned: true }),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('ChatGPT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, link, description, isPinned } = await request.json();

    if (!title || !link) {
      return NextResponse.json(
        { error: 'Title and link are required' },
        { status: 400 },
      );
    }

    const chat = await prisma.chatgptChat.create({
      data: {
        title,
        link,
        description: description || '',
        isPinned: isPinned || false,
        userId: session.user.id,
      },
    });

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Create ChatGPT chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
