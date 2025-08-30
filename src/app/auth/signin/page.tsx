'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center px-4'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-3xl animate-pulse delay-1000'></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='w-full max-w-md relative z-10'
      >
        <div className='p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='relative mx-auto mb-6'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-75 animate-pulse'></div>
              <div className='relative h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl'>
                <span className='text-white font-bold text-2xl'>P</span>
              </div>
            </div>
            <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
              Welcome Back
            </h1>
            <p className='text-gray-600 dark:text-gray-300 font-light'>
              Sign in to your ProductivityHub account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Input
                type='email'
                placeholder='Email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300'
              />
            </div>
            <div>
              <Input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300'
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm text-center'
              >
                {error}
              </motion.div>
            )}

            <Button
              type='submit'
              disabled={loading}
              className='w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 border-0 font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none'
            >
              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className='mt-8 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>
              Don&apos;t have an account?{' '}
              <Link
                href='/auth/signup'
                className='font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
