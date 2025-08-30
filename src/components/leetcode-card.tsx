'use client';

import { motion } from 'framer-motion';
import { formatDateTime } from '@/lib/utils';
import { Edit, Trash2, ExternalLink, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeetCodeProblem {
  id: string;
  title: string;
  link: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  notes?: string;
  tags: string[];
  lastVisited: string;
  createdAt: string;
}

interface LeetCodeCardProps {
  problem: LeetCodeProblem;
  onEdit: (problem: LeetCodeProblem) => void;
  onDelete: (id: string) => void;
}

const difficultyColors = {
  EASY: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-200 dark:border-green-700',
  },
  MEDIUM: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-200 dark:border-yellow-700',
  },
  HARD: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-700',
  },
};

export function LeetCodeCard({ problem, onEdit, onDelete }: LeetCodeCardProps) {
  const difficultyStyle = difficultyColors[problem.difficulty];

  const handleOpenLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(problem.link, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className='group p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-blue-200/30 dark:hover:shadow-blue-900/30 transition-all duration-300 cursor-pointer'
      onClick={() => onEdit(problem)}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-2'>
            <h3 className='font-semibold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
              {problem.title}
            </h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleOpenLink}
              className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400'
            >
              <ExternalLink className='h-3 w-3' />
            </Button>
          </div>

          <div className='flex items-center gap-3 mb-2'>
            {/* Difficulty Badge */}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border}`}
            >
              {problem.difficulty}
            </span>

            {/* Last Visited */}
            <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
              <Calendar className='h-3 w-3' />
              <span>
                Visited {formatDateTime(new Date(problem.lastVisited))}
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              onEdit(problem);
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
              onDelete(problem.id);
            }}
            className='h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Notes Preview */}
      {problem.notes && (
        <div className='mb-4'>
          <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3'>
            {problem.notes.length > 100
              ? problem.notes.substring(0, 100) + '...'
              : problem.notes}
          </p>
        </div>
      )}

      {/* Tags */}
      {problem.tags && problem.tags.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap'>
          <Tag className='h-3 w-3 text-gray-400' />
          {problem.tags.map((tag, index) => (
            <span
              key={index}
              className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
