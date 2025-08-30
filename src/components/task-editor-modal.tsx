'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, Tag, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  progress: number;
  tags?: { id: string; name: string; color: string }[];
}

interface TaskEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> & { id?: string }) => void;
  task?: Task | null;
}

const priorityOptions = [
  { value: 'LOW', label: 'Low', color: 'text-gray-600' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-blue-600' },
  { value: 'HIGH', label: 'High', color: 'text-orange-600' },
  { value: 'URGENT', label: 'Urgent', color: 'text-red-600' },
];

const priorityColors = {
  LOW: {
    bg: 'bg-gray-100 dark:bg-gray-800/30',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-200 dark:border-gray-700',
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

export function TaskEditorModal({
  isOpen,
  onClose,
  onSave,
  task,
}: TaskEditorModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  >('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      );
      setProgress(task.progress);
      setTags(task.tags?.map((tag) => tag.name) || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate('');
      setProgress(0);
      setTags([]);
    }
  }, [task, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: task?.id,
        title: title.trim(),
        description: description.trim(),
        completed: task?.completed || false,
        priority,
        dueDate: dueDate || undefined,
        progress,
        tags,
      });
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 bg-black/50 backdrop-blur-sm'
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className='relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30'
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
              {task ? 'Edit Task' : 'Create Task'}
            </h2>
            <div className='flex items-center gap-2'>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || saving}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg'
              >
                <Save className='h-4 w-4 mr-2' />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className='p-6 space-y-6'>
            {/* Title */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Task Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='What needs to be done?'
                className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400'
              />
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Add more details about this task...'
                rows={3}
                className='w-full rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 p-3 text-sm resize-none transition-all duration-300'
              />
            </div>

            {/* Priority and Due Date Row */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Priority */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Priority
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => setPriority(option.value as any)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        priority === option.value
                          ? `${
                              priorityColors[
                                option.value as keyof typeof priorityColors
                              ].bg
                            } ${
                              priorityColors[
                                option.value as keyof typeof priorityColors
                              ].text
                            } ${
                              priorityColors[
                                option.value as keyof typeof priorityColors
                              ].border
                            } border`
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Due Date
                </label>
                <Input
                  type='date'
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400'
                />
              </div>
            </div>

            {/* Progress */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Progress: {progress}%
              </label>
              <div className='space-y-2'>
                <input
                  type='range'
                  min='0'
                  max='100'
                  step='5'
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                />
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div
                    className='h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Tags
              </label>
              <div className='flex items-center gap-2 mb-3'>
                <div className='flex-1'>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='Add tags (e.g., Work, Personal, Urgent)...'
                    className='h-10 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400'
                  />
                </div>
                <Button
                  size='sm'
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  variant='outline'
                  className='rounded-xl'
                >
                  Add
                </Button>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div className='flex items-center gap-2 flex-wrap'>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full border border-blue-200 dark:border-blue-700'
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className='hover:text-red-600 dark:hover:text-red-400 transition-colors'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
