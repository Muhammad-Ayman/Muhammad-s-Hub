import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const problem = await prisma.leetcodeProblem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Update last visited
    await prisma.leetcodeProblem.update({
      where: { id: params.id },
      data: { lastVisited: new Date() },
    });

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Get LeetCode problem API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, link, difficulty, notes, tags } = await request.json();

    // Verify problem ownership
    const existingProblem = await prisma.leetcodeProblem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingProblem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const updatedProblem = await prisma.leetcodeProblem.update({
      where: { id: params.id },
      data: {
        title,
        link,
        difficulty,
        notes,
        tags: tags || [],
        lastVisited: new Date(),
      },
    });

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error('Update LeetCode problem API error:', error);
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

    // Verify problem ownership
    const existingProblem = await prisma.leetcodeProblem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingProblem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    await prisma.leetcodeProblem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Delete LeetCode problem API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
