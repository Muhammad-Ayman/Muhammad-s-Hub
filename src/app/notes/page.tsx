'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
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
              <h1 className='text-3xl font-bold'>Notes</h1>
              <p className='text-muted-foreground mt-2'>
                Capture your thoughts and ideas
              </p>
            </div>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              New Note
            </Button>
          </div>

          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <div className='text-muted-foreground text-center'>
                <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center'>
                  <Plus className='h-8 w-8' />
                </div>
                <h3 className='text-lg font-medium mb-2'>No notes yet</h3>
                <p className='text-sm mb-4'>
                  Create your first note to start documenting your ideas.
                </p>
                <Button>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
