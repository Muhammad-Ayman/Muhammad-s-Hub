'use client';

import { motion } from 'framer-motion';
import { formatDateTime } from '@/lib/utils';
import { Edit, Trash2, Tag, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string; color: string }[];
  folder?: { id: string; name: string; color: string } | null;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const getPreview = (content: string) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    return plainText.length > 150
      ? plainText.substring(0, 150) + '...'
      : plainText;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className='group p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-blue-200/30 dark:hover:shadow-blue-900/30 transition-all duration-300 cursor-pointer'
      onClick={() => onEdit(note)}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
            {note.title}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            {note.folder && (
              <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
                <Folder
                  className='h-3 w-3'
                  style={{ color: note.folder.color }}
                />
                <span>{note.folder.name}</span>
              </div>
            )}
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {formatDateTime(new Date(note.updatedAt))}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
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
              onDelete(note.id);
            }}
            className='h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Content Preview */}
      <div className='mb-4'>
        <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
          {getPreview(note.content) || 'No content'}
        </p>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap'>
          <Tag className='h-3 w-3 text-gray-400' />
          {note.tags.map((tag) => (
            <span
              key={tag.id}
              className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                border: `1px solid ${tag.color}40`,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
