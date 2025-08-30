import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, link, description, isPinned } = await request.json();

    // Verify chat ownership
    const existingChat = await prisma.chatgptChat.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingChat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const updatedChat = await prisma.chatgptChat.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify chat ownership
    const existingChat = await prisma.chatgptChat.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingChat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    await prisma.chatgptChat.delete({
      where: { id: params.id },
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
