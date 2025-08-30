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
    const folderId = searchParams.get('folderId');

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(folderId && { folderId }),
      },
      include: {
        tags: true,
        folder: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Notes API error:', error);
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

    const { title, content, folderId, tags } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content: content || '',
        userId: session.user.id,
        folderId: folderId || null,
      },
      include: {
        tags: true,
        folder: true,
      },
    });

    // Handle tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.tag.findFirst({
          where: {
            name: tagName,
            userId: session.user.id,
          },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              userId: session.user.id,
            },
          });
        }

        // Connect tag to note
        await prisma.note.update({
          where: { id: note.id },
          data: {
            tags: {
              connect: { id: tag.id },
            },
          },
        });
      }
    }

    const updatedNote = await prisma.note.findUnique({
      where: { id: note.id },
      include: {
        tags: true,
        folder: true,
      },
    });

    return NextResponse.json(updatedNote, { status: 201 });
  } catch (error) {
    console.error('Create note API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
