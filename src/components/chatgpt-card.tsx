'use client';

import { motion } from 'framer-motion';
import { formatDateTime } from '@/lib/utils';
import { Edit, Trash2, ExternalLink, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatGPTChat {
  id: string;
  title: string;
  link: string;
  description?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatGPTCardProps {
  chat: ChatGPTChat;
  onEdit: (chat: ChatGPTChat) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

export function ChatGPTCard({
  chat,
  onEdit,
  onDelete,
  onTogglePin,
}: ChatGPTCardProps) {
  const handleOpenLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(chat.link, '_blank');
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(chat.id, !chat.isPinned);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className='group p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-green-200/30 dark:hover:shadow-green-900/30 transition-all duration-300 cursor-pointer relative'
      onClick={() => onEdit(chat)}
    >
      {/* Pin indicator */}
      {chat.isPinned && (
        <div className='absolute top-4 right-4'>
          <Pin className='h-4 w-4 text-yellow-500 fill-current' />
        </div>
      )}

      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1 min-w-0 pr-8'>
          <div className='flex items-center gap-2 mb-2'>
            <h3 className='font-semibold text-lg text-gray-900 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
              {chat.title}
            </h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleOpenLink}
              className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-600 dark:hover:text-green-400'
            >
              <ExternalLink className='h-3 w-3' />
            </Button>
          </div>

          <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2'>
            <span>Updated {formatDateTime(new Date(chat.updatedAt))}</span>
          </div>
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleTogglePin}
            className={`h-8 w-8 p-0 transition-all duration-300 ${
              chat.isPinned
                ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20'
                : 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20 hover:text-yellow-600 dark:hover:text-yellow-400'
            }`}
          >
            {chat.isPinned ? (
              <PinOff className='h-4 w-4' />
            ) : (
              <Pin className='h-4 w-4' />
            )}
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              onEdit(chat);
            }}
            className='h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chat.id);
            }}
            className='h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Description */}
      {chat.description && (
        <div className='mb-4'>
          <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3'>
            {chat.description.length > 150
              ? chat.description.substring(0, 150) + '...'
              : chat.description}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            ChatGPT
          </span>
        </div>

        {chat.isPinned && (
          <div className='flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400'>
            <Pin className='h-3 w-3 fill-current' />
            <span>Pinned</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
