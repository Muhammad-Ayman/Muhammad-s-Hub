'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ExternalLink, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LeetCodeProblem {
  id?: string;
  title: string;
  link: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  notes?: string;
  tags: string[];
}

interface LeetCodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: Omit<LeetCodeProblem, 'id'> & { id?: string }) => void;
  problem?: LeetCodeProblem | null;
}

const difficultyOptions = [
  { value: 'EASY', label: 'Easy', color: 'text-green-600' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
  { value: 'HARD', label: 'Hard', color: 'text-red-600' },
];

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

export function LeetCodeEditorModal({
  isOpen,
  onClose,
  onSave,
  problem,
}: LeetCodeEditorModalProps) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (problem) {
      setTitle(problem.title);
      setLink(problem.link);
      setDifficulty(problem.difficulty);
      setNotes(problem.notes || '');
      setTags(problem.tags || []);
    } else {
      setTitle('');
      setLink('');
      setDifficulty('MEDIUM');
      setNotes('');
      setTags([]);
    }
  }, [problem, isOpen]);

  const handleSave = async () => {
    if (!title.trim() || !link.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: problem?.id,
        title: title.trim(),
        link: link.trim(),
        difficulty,
        notes: notes.trim(),
        tags,
      });
      onClose();
    } catch (error) {
      console.error('Error saving problem:', error);
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
              {problem ? 'Edit Problem' : 'Add LeetCode Problem'}
            </h2>
            <div className='flex items-center gap-2'>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !link.trim() || saving}
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
                Problem Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., Two Sum, Valid Parentheses...'
                className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400'
              />
            </div>

            {/* Link */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                LeetCode Link *
              </label>
              <div className='relative'>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder='https://leetcode.com/problems/...'
                  className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 pr-10'
                />
                {link && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => window.open(link, '_blank')}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
                  >
                    <ExternalLink className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Difficulty *
              </label>
              <div className='flex gap-2'>
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => setDifficulty(option.value as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      difficulty === option.value
                        ? `${difficultyColors[option.value as keyof typeof difficultyColors].bg} ${difficultyColors[option.value as keyof typeof difficultyColors].text} ${difficultyColors[option.value as keyof typeof difficultyColors].border} border`
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
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
                    placeholder='Add tags (e.g., Array, Hash Table)...'
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

            {/* Notes */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Add your notes, approach, time complexity, etc...'
                rows={6}
                className='w-full rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 p-3 text-sm resize-none transition-all duration-300'
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
