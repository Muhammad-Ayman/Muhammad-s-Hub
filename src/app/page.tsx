'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckSquare,
  FileText,
  Code,
  MessageSquare,
  Zap,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description:
      'Organize your tasks with custom tags, deadlines, and progress tracking.',
  },
  {
    icon: FileText,
    title: 'Rich Note Taking',
    description:
      'Create and organize notes with Markdown support and powerful search.',
  },
  {
    icon: Code,
    title: 'LeetCode Tracker',
    description:
      'Save and manage your favorite coding problems with difficulty filters.',
  },
  {
    icon: MessageSquare,
    title: 'ChatGPT Favorites',
    description: 'Bookmark your best AI conversations for easy reference.',
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-600/10 blur-3xl animate-pulse delay-500'></div>
      </div>

      {/* Hero Section */}
      <section className='relative z-10'>
        <div className='container mx-auto px-6 py-20'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className='text-center max-w-5xl mx-auto'
          >
            {/* Logo and Title */}
            <motion.div
              className='flex items-center justify-center mb-12'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-75 animate-pulse'></div>
                <div className='relative h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-6 shadow-2xl'>
                  <Zap className='h-10 w-10 text-white' />
                </div>
              </div>
              <div className='text-left'>
                <h1 className='text-6xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight'>
                  Productivity
                </h1>
                <div className='text-4xl md:text-5xl font-light text-gray-600 dark:text-gray-300 -mt-2'>
                  Hub
                </div>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto font-light'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform your productivity with our all-in-one platform.
              Seamlessly manage tasks, capture ideas, track coding challenges,
              and organize AI conversations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className='flex flex-col sm:flex-row gap-6 justify-center items-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size='lg'
                asChild
                className='text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/25 border-0 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105'
              >
                <Link href='/auth/signup'>
                  <span className='flex items-center'>
                    Get Started Free
                    <ArrowRight className='ml-3 h-5 w-5' />
                  </span>
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                className='text-lg px-10 py-6 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl font-semibold transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80'
              >
                <Link href='/auth/signin'>Sign In</Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className='mt-16 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                <span>Free to use</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                <span>No credit card required</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-purple-500 rounded-full animate-pulse'></div>
                <span>Setup in 2 minutes</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-32 relative z-10'>
        <div className='container mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center mb-20'
          >
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
              Everything you need to stay productive
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed'>
              Streamline your workflow with powerful features designed for
              modern productivity and seamless collaboration.
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className='h-full p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-3xl hover:shadow-blue-200/30 dark:hover:shadow-blue-900/30 transition-all duration-500 group'>
                  <div className='mb-6 relative'>
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    <div className='relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg'>
                      <feature.icon className='h-8 w-8 text-white' />
                    </div>
                  </div>
                  <h3 className='text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300 leading-relaxed font-light'>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-32 relative z-10'>
        <div className='container mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative'
          >
            {/* Background decoration */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl'></div>

            <div className='relative p-16 rounded-3xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl'>
              <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                Ready to boost your productivity?
              </h2>
              <p className='text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed'>
                Join thousands of users who have transformed their workflow with
                Muhammad's Hub. Start your journey today.
              </p>

              <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                <Button
                  size='lg'
                  asChild
                  className='text-lg px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/25 border-0 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105'
                >
                  <Link href='/auth/signup'>
                    <span className='flex items-center'>
                      Start Your Journey
                      <ArrowRight className='ml-3 h-5 w-5' />
                    </span>
                  </Link>
                </Button>

                <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                  <div className='flex items-center gap-2'>
                    <CheckSquare className='h-4 w-4 text-green-500' />
                    <span>Free forever</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Zap className='h-4 w-4 text-blue-500' />
                    <span>Instant setup</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
