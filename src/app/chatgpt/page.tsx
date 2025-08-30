'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Pin, MessageSquare } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatGPTCard } from '@/components/chatgpt-card';
import { ChatGPTEditorModal } from '@/components/chatgpt-editor-modal';

interface ChatGPTChat {
  id: string;
  title: string;
  link: string;
  description?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChatGPTPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<ChatGPTChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingChat, setEditingChat] = useState<ChatGPTChat | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchChats();
    }
  }, [session, searchQuery, showPinnedOnly]);

  const fetchChats = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (showPinnedOnly) params.append('pinned', 'true');

      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/chatgpt?${params}`);
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = () => {
    setEditingChat(null);
    setIsEditorOpen(true);
  };

  const handleEditChat = (chat: ChatGPTChat) => {
    setEditingChat(chat);
    setIsEditorOpen(true);
  };

  const handleSaveChat = async (
    chatData: Omit<ChatGPTChat, 'id'> & { id?: string },
  ) => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const url = chatData.id
        ? `${baseUrl}/api/chatgpt/${chatData.id}`
        : `${baseUrl}/api/chatgpt`;
      const method = chatData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData),
      });

      if (response.ok) {
        fetchChats();
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const handleDeleteChat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/chatgpt/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchChats();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/chatgpt/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned }),
      });

      if (response.ok) {
        fetchChats();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-green-600'></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const pinnedChats = chats.filter((chat) => chat.isPinned);
  const unpinnedChats = chats.filter((chat) => !chat.isPinned);
  const filteredChats = showPinnedOnly ? pinnedChats : chats;

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
                ChatGPT Favorites
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mt-2 font-light'>
                Save and organize your best AI conversations
              </p>
            </div>
            <Button
              onClick={handleCreateChat}
              className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
            >
              <Plus className='h-4 w-4 mr-2' />
              Save Chat
            </Button>
          </div>

          {/* Filters */}
          <div className='flex items-center gap-4 mb-8'>
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search chats...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-green-500 dark:focus:border-green-400'
                />
              </div>
            </div>

            <Button
              variant={showPinnedOnly ? 'default' : 'outline'}
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`h-12 px-4 rounded-xl transition-all duration-300 ${
                showPinnedOnly
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-yellow-500 dark:hover:border-yellow-400'
              }`}
            >
              <Pin className='h-4 w-4 mr-2' />
              {showPinnedOnly ? 'Show All' : 'Pinned Only'}
            </Button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-2'>
                <MessageSquare className='h-4 w-4 text-white' />
              </div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {chats.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Total Chats
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center mb-2'>
                <Pin className='h-4 w-4 text-white' />
              </div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {pinnedChats.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Pinned
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-2'>
                <MessageSquare className='h-4 w-4 text-white' />
              </div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {unpinnedChats.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Regular
              </div>
            </motion.div>
          </div>

          {/* Chats Grid */}
          {filteredChats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col items-center justify-center py-20'
            >
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center mb-6'>
                <MessageSquare className='h-10 w-10 text-green-600 dark:text-green-400' />
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
                {searchQuery || showPinnedOnly
                  ? 'No chats found'
                  : 'No chats saved yet'}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md'>
                {searchQuery || showPinnedOnly
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start saving your favorite ChatGPT conversations to build your personal AI knowledge base.'}
              </p>
              <Button
                onClick={handleCreateChat}
                className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg rounded-xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
              >
                <Plus className='h-4 w-4 mr-2' />
                Save Your First Chat
              </Button>
            </motion.div>
          ) : (
            <div>
              {/* Pinned Chats Section */}
              {pinnedChats.length > 0 && !showPinnedOnly && (
                <div className='mb-8'>
                  <div className='flex items-center gap-2 mb-4'>
                    <Pin className='h-5 w-5 text-yellow-500' />
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      Pinned Chats
                    </h2>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {pinnedChats.map((chat, index) => (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ChatGPTCard
                          chat={chat}
                          onEdit={handleEditChat}
                          onDelete={handleDeleteChat}
                          onTogglePin={handleTogglePin}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All/Regular Chats Section */}
              {(showPinnedOnly ? pinnedChats : unpinnedChats).length > 0 && (
                <div>
                  {!showPinnedOnly && pinnedChats.length > 0 && (
                    <div className='flex items-center gap-2 mb-4'>
                      <MessageSquare className='h-5 w-5 text-gray-500' />
                      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                        All Chats
                      </h2>
                    </div>
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {(showPinnedOnly ? pinnedChats : unpinnedChats).map(
                      (chat, index) => (
                        <motion.div
                          key={chat.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ChatGPTCard
                            chat={chat}
                            onEdit={handleEditChat}
                            onDelete={handleDeleteChat}
                            onTogglePin={handleTogglePin}
                          />
                        </motion.div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Chat Editor Modal */}
      <ChatGPTEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveChat}
        chat={editingChat}
      />
    </div>
  );
}
