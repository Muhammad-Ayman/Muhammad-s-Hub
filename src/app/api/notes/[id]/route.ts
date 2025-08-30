import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
      include: {
        tags: true,
        folder: true,
      },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Get note API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;

    const { title, content, folderId, tags } = await request.json();

    // Verify note ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Update note
    await prisma.note.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        content,
        folderId: folderId || null,
        tags: {
          set: [], // Clear existing tags
        },
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
          where: { id: resolvedParams.id },
          data: {
            tags: {
              connect: { id: tag.id },
            },
          },
        });
      }
    }

    const finalNote = await prisma.note.findUnique({
      where: { id: resolvedParams.id },
      include: {
        tags: true,
        folder: true,
      },
    });

    return NextResponse.json(finalNote);
  } catch (error) {
    console.error('Update note API error:', error);
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

    // Verify note ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await prisma.note.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
