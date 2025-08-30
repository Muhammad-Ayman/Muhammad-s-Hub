'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  FileText,
  Code,
  MessageSquare,
  Calendar,
  TrendingUp,
  Plus,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalNotes: number;
  recentLeetcode: any[];
  pinnedChats: any[];
  todaysTasks: any[];
  recentNotes: any[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        console.error('Unauthorized - redirecting to sign in');
        router.push('/auth/signin');
        return;
      } else {
        console.error('Error response:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const completionRate = stats
    ? (stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100
    : 0;

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />

      <main className='container mx-auto px-6 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-foreground'>
              Welcome back, {session.user.name || session.user.email}!
            </h1>
            <p className='text-muted-foreground mt-2'>
              Here&apos;s what&apos;s happening with your productivity today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Tasks
                  </CardTitle>
                  <CheckSquare className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.totalTasks || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {stats?.completedTasks || 0} completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Completion Rate
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {completionRate.toFixed(0)}%
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Keep up the great work!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Notes</CardTitle>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.totalNotes || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Knowledge base
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    LeetCode
                  </CardTitle>
                  <Code className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.recentLeetcode?.length || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Favorite problems
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Today&apos;s Tasks</span>
                    <Button size='sm' onClick={() => router.push('/tasks')}>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Task
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Focus on what needs to be done today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.todaysTasks?.length ? (
                    <div className='space-y-3'>
                      {stats.todaysTasks.slice(0, 5).map((task: any) => (
                        <div
                          key={task.id}
                          className='flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50'
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              task.completed ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                          />
                          <span
                            className={
                              task.completed
                                ? 'line-through text-muted-foreground'
                                : ''
                            }
                          >
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-center py-8'>
                      No tasks for today. Great job! 🎉
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Recent Notes</span>
                    <Button size='sm' onClick={() => router.push('/notes')}>
                      <Plus className='h-4 w-4 mr-2' />
                      New Note
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your latest thoughts and ideas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.recentNotes?.length ? (
                    <div className='space-y-3'>
                      {stats.recentNotes.slice(0, 5).map((note: any) => (
                        <div
                          key={note.id}
                          className='p-2 rounded-lg hover:bg-accent/50 cursor-pointer'
                        >
                          <h4 className='font-medium'>{note.title}</h4>
                          <p className='text-sm text-muted-foreground'>
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-center py-8'>
                      No notes yet. Start documenting your ideas! 📝
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent LeetCode Problems */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Recent LeetCode</span>
                    <Button size='sm' onClick={() => router.push('/leetcode')}>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Problem
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your latest coding challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.recentLeetcode?.length ? (
                    <div className='space-y-3'>
                      {stats.recentLeetcode.slice(0, 3).map((problem: any) => (
                        <div
                          key={problem.id}
                          className='p-2 rounded-lg hover:bg-accent/50'
                        >
                          <h4 className='font-medium'>{problem.title}</h4>
                          <div className='flex items-center space-x-2 mt-1'>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                problem.difficulty === 'EASY'
                                  ? 'bg-green-100 text-green-800'
                                  : problem.difficulty === 'MEDIUM'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-center py-8'>
                      No LeetCode problems saved yet. Start coding! 💻
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Pinned ChatGPT Chats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Pinned ChatGPT Chats</span>
                    <Button size='sm' onClick={() => router.push('/chatgpt')}>
                      <Plus className='h-4 w-4 mr-2' />
                      Pin Chat
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your favorite AI conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.pinnedChats?.length ? (
                    <div className='space-y-3'>
                      {stats.pinnedChats.slice(0, 3).map((chat: any) => (
                        <div
                          key={chat.id}
                          className='p-2 rounded-lg hover:bg-accent/50'
                        >
                          <h4 className='font-medium'>{chat.title}</h4>
                          <p className='text-sm text-muted-foreground'>
                            {chat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-center py-8'>
                      No pinned chats yet. Save your best conversations! 💬
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
