'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Code2 } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LeetCodeCard } from '@/components/leetcode-card';
import { LeetCodeEditorModal } from '@/components/leetcode-editor-modal';

interface LeetCodeProblem {
  id: string;
  title: string;
  link: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  notes?: string;
  tags: string[];
  lastVisited?: string;
  createdAt?: string;
}

export default function LeetCodePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<LeetCodeProblem | null>(
    null,
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const fetchProblems = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);

      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/leetcode?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProblems(data);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDifficulty]);

  useEffect(() => {
    if (session?.user) {
      fetchProblems();
    }
  }, [session, fetchProblems]);

  const handleCreateProblem = () => {
    setEditingProblem(null);
    setIsEditorOpen(true);
  };

  const handleEditProblem = (problem: LeetCodeProblem) => {
    setEditingProblem(problem);
    setIsEditorOpen(true);
  };

  const handleSaveProblem = async (
    problemData: Omit<LeetCodeProblem, 'id'> & { id?: string },
  ) => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const url = problemData.id
        ? `${baseUrl}/api/leetcode/${problemData.id}`
        : `${baseUrl}/api/leetcode`;
      const method = problemData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemData),
      });

      if (response.ok) {
        fetchProblems();
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error saving problem:', error);
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;

    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/leetcode/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProblems();
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
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

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      !searchQuery ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      !selectedDifficulty || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
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
                LeetCode Favorites
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mt-2 font-light'>
                Track your favorite coding problems and solutions
              </p>
            </div>
            <Button
              onClick={handleCreateProblem}
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Problem
            </Button>
          </div>

          {/* Filters */}
          <div className='flex items-center gap-4 mb-8'>
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search problems...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400'
                />
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-gray-500' />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className='h-12 px-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 text-sm'
              >
                <option value=''>All difficulties</option>
                <option value='EASY'>Easy</option>
                <option value='MEDIUM'>Medium</option>
                <option value='HARD'>Hard</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
            {['EASY', 'MEDIUM', 'HARD', 'ALL'].map((difficulty) => {
              const count =
                difficulty === 'ALL'
                  ? problems.length
                  : problems.filter((p) => p.difficulty === difficulty).length;
              const colors = {
                EASY: 'from-green-500 to-emerald-600',
                MEDIUM: 'from-yellow-500 to-orange-600',
                HARD: 'from-red-500 to-pink-600',
                ALL: 'from-blue-500 to-purple-600',
              };

              return (
                <motion.div
                  key={difficulty}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                      colors[difficulty as keyof typeof colors]
                    } flex items-center justify-center mb-2`}
                  >
                    <Code2 className='h-4 w-4 text-white' />
                  </div>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {count}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    {difficulty === 'ALL' ? 'Total' : difficulty}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Problems Grid */}
          {filteredProblems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col items-center justify-center py-20'
            >
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6'>
                <Code2 className='h-10 w-10 text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
                {searchQuery || selectedDifficulty
                  ? 'No problems found'
                  : 'No problems saved yet'}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md'>
                {searchQuery || selectedDifficulty
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start saving your favorite LeetCode problems to track your coding progress and solutions.'}
              </p>
              <Button
                onClick={handleCreateProblem}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Your First Problem
              </Button>
            </motion.div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <LeetCodeCard
                    problem={problem}
                    onEdit={handleEditProblem}
                    onDelete={handleDeleteProblem}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Problem Editor Modal */}
      <LeetCodeEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProblem}
        problem={editingProblem}
      />
    </div>
  );
}
