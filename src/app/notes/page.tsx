'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Folder, FileText } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NoteCard } from '@/components/note-card';
import { NoteEditorModal } from '@/components/note-editor-modal';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string; color: string }[];
  folder?: { id: string; name: string; color: string } | null;
  folderId?: string | null;
}

interface NotesFolder {
  id: string;
  name: string;
  color: string;
  _count: { notes: number };
}

export default function NotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<NotesFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchNotes();
      fetchFolders();
    }
  }, [session, searchQuery, selectedFolderId]);

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedFolderId) params.append('folderId', selectedFolderId);

      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/notes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/folders`);
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (
    noteData: Omit<Note, 'id'> & { id?: string },
  ) => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const url = noteData.id
        ? `${baseUrl}/api/notes/${noteData.id}`
        : `${baseUrl}/api/notes`;
      const method = noteData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        fetchNotes();
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      !selectedFolderId || note.folderId === selectedFolderId;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950'>
      <Navigation />

      <main className='container mx-auto px-6 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                Notes
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mt-2 font-light'>
                Capture your thoughts and ideas with rich markdown support
              </p>
            </div>
            <Button
              onClick={handleCreateNote}
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
            >
              <Plus className='h-4 w-4 mr-2' />
              New Note
            </Button>
          </div>

          {/* Filters */}
          <div className='flex items-center gap-4 mb-8'>
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search notes...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400'
                />
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Folder className='h-4 w-4 text-gray-500' />
              <select
                value={selectedFolderId || ''}
                onChange={(e) => setSelectedFolderId(e.target.value || null)}
                className='h-12 px-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 text-sm'
              >
                <option value=''>All folders</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name} ({folder._count.notes})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col items-center justify-center py-20'
            >
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6'>
                <FileText className='h-10 w-10 text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
                {searchQuery || selectedFolderId
                  ? 'No notes found'
                  : 'No notes yet'}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md'>
                {searchQuery || selectedFolderId
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first note to start documenting your ideas with our powerful markdown editor.'}
              </p>
              <Button
                onClick={handleCreateNote}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
              >
                <Plus className='h-4 w-4 mr-2' />
                Create Your First Note
              </Button>
            </motion.div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <NoteCard
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        folders={folders}
      />
    </div>
  );
}
