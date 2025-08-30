'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />

      <main className='container mx-auto px-6 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold'>Tasks</h1>
              <p className='text-muted-foreground mt-2'>
                Manage your tasks and stay organized
              </p>
            </div>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              New Task
            </Button>
          </div>

          <div className='flex items-center space-x-4 mb-8'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input placeholder='Search tasks...' className='pl-10' />
              </div>
            </div>
            <Button variant='outline'>
              <Filter className='h-4 w-4 mr-2' />
              Filter
            </Button>
          </div>

          {tasks.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-16'>
                <div className='text-muted-foreground text-center'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center'>
                    <Plus className='h-8 w-8' />
                  </div>
                  <h3 className='text-lg font-medium mb-2'>No tasks yet</h3>
                  <p className='text-sm mb-4'>
                    Create your first task to get started with your productivity
                    journey.
                  </p>
                  <Button>
                    <Plus className='h-4 w-4 mr-2' />
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {/* Tasks will be rendered here */}
              <p className='text-muted-foreground'>
                Tasks functionality coming soon...
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
