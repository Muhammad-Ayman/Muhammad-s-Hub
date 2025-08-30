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
    const difficulty = searchParams.get('difficulty');
    const tags = searchParams.get('tags');

    const problems = await prisma.leetcodeProblem.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { notes: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(difficulty && {
          difficulty: difficulty as 'EASY' | 'MEDIUM' | 'HARD',
        }),
        ...(tags && {
          tags: {
            hasSome: tags.split(','),
          },
        }),
      },
      orderBy: { lastVisited: 'desc' },
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error('LeetCode API error:', error);
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

    const { title, link, difficulty, notes, tags } = await request.json();

    if (!title || !link || !difficulty) {
      return NextResponse.json(
        { error: 'Title, link, and difficulty are required' },
        { status: 400 },
      );
    }

    const problem = await prisma.leetcodeProblem.create({
      data: {
        title,
        link,
        difficulty,
        notes: notes || '',
        tags: tags || [],
        userId: session.user.id,
      },
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error('Create LeetCode problem API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
