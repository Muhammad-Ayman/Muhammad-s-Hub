import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    console.log('Dashboard - Session:', session);
    console.log('Dashboard - User ID:', session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          debug: {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
          },
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // Get tasks statistics
    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    const completedTasks = await prisma.task.count({
      where: { userId, completed: true },
    });

    // Get today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysTasks = await prisma.task.findMany({
      where: {
        userId,
        OR: [
          {
            dueDate: {
              gte: today,
              lt: tomorrow,
            },
          },
          {
            dueDate: null,
            createdAt: {
              gte: today,
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get notes statistics
    const totalNotes = await prisma.note.count({
      where: { userId },
    });

    const recentNotes = await prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    });

    // Get recent LeetCode problems
    const recentLeetcode = await prisma.leetcodeProblem.findMany({
      where: { userId },
      orderBy: { lastVisited: 'desc' },
      take: 3,
    });

    // Get pinned ChatGPT chats
    const pinnedChats = await prisma.chatgptChat.findMany({
      where: { userId, isPinned: true },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    });

    return NextResponse.json({
      totalTasks,
      completedTasks,
      totalNotes,
      todaysTasks,
      recentNotes,
      recentLeetcode,
      pinnedChats,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
