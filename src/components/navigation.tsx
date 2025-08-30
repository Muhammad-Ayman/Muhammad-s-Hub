'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CheckSquare,
  FileText,
  Code,
  MessageSquare,
  LogOut,
  User,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'LeetCode', href: '/leetcode', icon: Code },
  { name: 'ChatGPT', href: '/chatgpt', icon: MessageSquare },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className='sticky top-0 z-50 h-20 flex items-center justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 px-6 shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20'>
      <div className='flex items-center space-x-8'>
        <Link href='/dashboard' className='flex items-center space-x-3 group'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300'></div>
            <div className='relative h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg'>
              <span className='text-white font-bold text-lg'>P</span>
            </div>
          </div>
          <span className='font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
            Muhammad's Hub
          </span>
        </Link>

        <div className='hidden md:flex items-center space-x-2'>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
                )}
              >
                {isActive && (
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl border border-blue-200/50 dark:border-blue-700/50'></div>
                )}
                <Icon className='h-4 w-4 relative z-10' />
                <span className='relative z-10'>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <ThemeToggle />
        {session?.user && (
          <div className='flex items-center space-x-3'>
            <div className='hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm'>
              <div className='h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                <User className='h-4 w-4 text-white' />
              </div>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300 max-w-32 truncate'>
                {session.user.name || session.user.email}
              </span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => signOut()}
              className='h-10 w-10 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300'
            >
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
