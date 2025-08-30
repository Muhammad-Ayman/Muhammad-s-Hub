import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, link, description, isPinned } = await request.json();
    const resolvedParams = await params;

    // Verify chat ownership
    const existingChat = await prisma.chatgptChat.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    });

    if (!existingChat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const updatedChat = await prisma.chatgptChat.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        link,
        description,
        isPinned,
      },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error('Update ChatGPT chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;

    // Verify chat ownership
    const existingChat = await prisma.chatgptChat.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    });

    if (!existingChat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    await prisma.chatgptChat.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete ChatGPT chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
