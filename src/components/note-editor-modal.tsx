'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Folder, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/markdown-editor';

interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  folderId?: string | null;
  tags?: string[] | { id: string; name: string; color: string }[];
  folder?: { id: string; name: string; color: string } | null;
}

interface Folder {
  id: string;
  name: string;
  color: string;
}

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id'> & { id?: string }) => Promise<void>;
  note?: Note | null;
  folders: Folder[];
}

export function NoteEditorModal({
  isOpen,
  onClose,
  onSave,
  note,
  folders,
}: NoteEditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedFolderId(note.folderId || null);
      setTags(
        note.tags?.map((tag) => (typeof tag === 'string' ? tag : tag.name)) ||
          [],
      );
    } else {
      setTitle('');
      setContent('');
      setSelectedFolderId(null);
      setTags([]);
    }
  }, [note, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: note?.id,
        title: title.trim(),
        content,
        folderId: selectedFolderId,
        tags,
      });
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
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
          className='relative w-full max-w-4xl max-h-[90vh] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 flex flex-col'
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
              {note ? 'Edit Note' : 'Create Note'}
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
          <div className='flex-1 overflow-hidden flex flex-col'>
            {/* Title and Metadata */}
            <div className='p-6 border-b border-gray-200/50 dark:border-gray-700/50'>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Note title...'
                className='text-xl font-semibold border-none bg-transparent px-0 focus-visible:ring-0 placeholder:text-gray-400'
              />

              {/* Metadata Row */}
              <div className='flex items-center gap-4 mt-4 flex-wrap'>
                {/* Folder Selection */}
                <div className='flex items-center gap-2'>
                  <Folder className='h-4 w-4 text-gray-500' />
                  <select
                    value={selectedFolderId || ''}
                    onChange={(e) =>
                      setSelectedFolderId(e.target.value || null)
                    }
                    className='text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 focus:border-blue-500 dark:focus:border-blue-400'
                  >
                    <option value=''>No folder</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Input */}
                <div className='flex items-center gap-2'>
                  <Tag className='h-4 w-4 text-gray-500' />
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='Add tags...'
                    className='w-32 text-sm h-8'
                  />
                  <Button
                    size='sm'
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div className='flex items-center gap-2 mt-3 flex-wrap'>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full'
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className='hover:text-red-600 dark:hover:text-red-400'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Editor */}
            <div className='flex-1 p-6 overflow-hidden'>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder='Start writing your note...'
                height={400}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
