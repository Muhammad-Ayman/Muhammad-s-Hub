'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ExternalLink, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatGPTChat {
  id?: string;
  title: string;
  link: string;
  description?: string;
  isPinned: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ChatGPTEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chat: Omit<ChatGPTChat, 'id'> & { id?: string }) => Promise<void>;
  chat?: ChatGPTChat | null;
}

export function ChatGPTEditorModal({
  isOpen,
  onClose,
  onSave,
  chat,
}: ChatGPTEditorModalProps) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (chat) {
      setTitle(chat.title);
      setLink(chat.link);
      setDescription(chat.description || '');
      setIsPinned(chat.isPinned);
    } else {
      setTitle('');
      setLink('');
      setDescription('');
      setIsPinned(false);
    }
  }, [chat, isOpen]);

  const handleSave = async () => {
    if (!title.trim() || !link.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: chat?.id,
        title: title.trim(),
        link: link.trim(),
        description: description.trim(),
        isPinned,
      });
      onClose();
    } catch (error) {
      console.error('Error saving chat:', error);
    } finally {
      setSaving(false);
    }
  };

  const extractTitleFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (
        urlObj.hostname.includes('chatgpt') ||
        urlObj.hostname.includes('openai')
      ) {
        // Extract potential title from URL path or use default
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          const lastSegment = pathSegments[pathSegments.length - 1];
          if (lastSegment && lastSegment !== 'c') {
            return decodeURIComponent(lastSegment).replace(/-/g, ' ');
          }
        }
        return 'ChatGPT Conversation';
      }
      return '';
    } catch {
      return '';
    }
  };

  const handleLinkChange = (newLink: string) => {
    setLink(newLink);
    // Auto-suggest title if empty
    if (!title.trim() && newLink.trim()) {
      const suggestedTitle = extractTitleFromUrl(newLink);
      if (suggestedTitle) {
        setTitle(suggestedTitle);
      }
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
              {chat ? 'Edit Chat' : 'Save ChatGPT Chat'}
            </h2>
            <div className='flex items-center gap-2'>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !link.trim() || saving}
                className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg'
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
                Chat Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., React Best Practices, Python Data Analysis...'
                className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-green-500 dark:focus:border-green-400'
              />
            </div>

            {/* Link */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                ChatGPT Link *
              </label>
              <div className='relative'>
                <Input
                  value={link}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  placeholder='https://chatgpt.com/c/...'
                  className='h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-green-500 dark:focus:border-green-400 pr-10'
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
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Copy the URL from your ChatGPT conversation
              </p>
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='What was this conversation about? Key insights, solutions, etc...'
                rows={4}
                className='w-full rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-green-500 dark:focus:border-green-400 p-3 text-sm resize-none transition-all duration-300'
              />
            </div>

            {/* Pin Toggle */}
            <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center'>
                  <Pin className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='font-medium text-gray-900 dark:text-white'>
                    Pin to Dashboard
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    Show this chat on your dashboard
                  </div>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setIsPinned(!isPinned)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                  isPinned ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    isPinned ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
