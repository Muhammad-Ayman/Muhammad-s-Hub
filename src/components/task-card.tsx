'use client';

import { motion } from 'framer-motion';
import { isOverdue, getDaysUntilDue } from '@/lib/utils';
import { Edit, Trash2, Calendar, Tag, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[] | { id: string; name: string; color: string }[];
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const priorityColors = {
  LOW: {
    bg: 'bg-gray-100 dark:bg-gray-800/30',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
  },
  MEDIUM: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-700',
  },
  HIGH: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-700',
  },
  URGENT: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-700',
  },
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) {
  const priorityStyle = priorityColors[task.priority];
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = dueDate ? isOverdue(dueDate) : false;
  const daysUntil = dueDate ? getDaysUntilDue(dueDate) : null;

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id, !task.completed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 cursor-pointer ${
        task.completed
          ? 'hover:shadow-green-200/30 dark:hover:shadow-green-900/30'
          : 'hover:shadow-blue-200/30 dark:hover:shadow-blue-900/30'
      }`}
      onClick={() => onEdit(task)}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-start gap-3 flex-1 min-w-0'>
          {/* Completion Toggle */}
          <Button
            variant='ghost'
            size='sm'
            onClick={handleToggleComplete}
            className={`h-6 w-6 p-0 rounded-full transition-all duration-300 ${
              task.completed
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            {task.completed ? (
              <CheckCircle className='h-5 w-5 fill-current' />
            ) : (
              <Circle className='h-5 w-5' />
            )}
          </Button>

          <div className='flex-1 min-w-0'>
            <h3
              className={`font-semibold text-lg truncate transition-colors ${
                task.completed
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
              }`}
            >
              {task.title}
            </h3>

            <div className='flex items-center gap-2 mt-1 flex-wrap'>
              {/* Priority Badge */}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
              >
                {task.priority}
              </span>

              {/* Due Date */}
              {dueDate && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    overdue
                      ? 'text-red-600 dark:text-red-400'
                      : daysUntil !== null && daysUntil <= 1
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Calendar className='h-3 w-3' />
                  <span>
                    {overdue
                      ? `Overdue by ${Math.abs(daysUntil || 0)} days`
                      : daysUntil === 0
                      ? 'Due today'
                      : daysUntil === 1
                      ? 'Due tomorrow'
                      : `Due in ${daysUntil} days`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
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
              onDelete(task.id);
            }}
            className='h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className='mb-4'>
          <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2'>
            {task.description}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      {task.progress > 0 && (
        <div className='mb-4'>
          <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1'>
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                task.completed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap'>
          <Tag className='h-3 w-3 text-gray-400' />
          {task.tags.map((tag, index) => {
            const isString = typeof tag === 'string';
            const tagKey = isString ? `${tag}-${index}` : tag.id;
            const tagName = isString ? tag : tag.name;
            const tagColor = isString ? '#3B82F6' : tag.color;

            return (
              <span
                key={tagKey}
                className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
                style={{
                  backgroundColor: `${tagColor}20`,
                  color: tagColor,
                  border: `1px solid ${tagColor}40`,
                }}
              >
                {tagName}
              </span>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
