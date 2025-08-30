'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskCard } from '@/components/task-card';
import { TaskEditorModal } from '@/components/task-editor-modal';

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

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedPriority) params.append('priority', selectedPriority);
      if (!showCompleted) params.append('hideCompleted', 'true');

      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/tasks?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedPriority, showCompleted]);

  useEffect(() => {
    if (session?.user) {
      fetchTasks();
    }
  }, [session, fetchTasks]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsEditorOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditorOpen(true);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, 'id'> & { id?: string },
  ) => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const url = taskData.id
        ? `${baseUrl}/api/tasks/${taskData.id}`
        : `${baseUrl}/api/tasks`;
      const method = taskData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        fetchTasks();
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
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

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      !selectedPriority || task.priority === selectedPriority;
    const matchesCompleted = showCompleted || !task.completed;
    return matchesSearch && matchesPriority && matchesCompleted;
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
                Tasks
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mt-2 font-light'>
                Manage your tasks and boost your productivity
              </p>
            </div>
            <Button
              onClick={handleCreateTask}
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
            >
              <Plus className='h-4 w-4 mr-2' />
              New Task
            </Button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-2'>
                <CheckSquare className='h-4 w-4 text-white' />
              </div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {tasks.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Total Tasks
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-2'>
                <CheckSquare className='h-4 w-4 text-white' />
              </div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {completedTasks.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Completed
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center mb-2'>
                <Clock className='h-4 w-4 text-white' />
              </div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {pendingTasks.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Pending
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className='p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg'
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center mb-2'>
                <TrendingUp className='h-4 w-4 text-white' />
              </div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {overdueTasks.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Overdue
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className='flex items-center gap-4 mb-8 flex-wrap'>
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search tasks...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 h-12 rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400'
                />
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-gray-500' />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className='h-12 px-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 text-sm'
              >
                <option value=''>All priorities</option>
                <option value='LOW'>Low</option>
                <option value='MEDIUM'>Medium</option>
                <option value='HIGH'>High</option>
                <option value='URGENT'>Urgent</option>
              </select>
            </div>

            <Button
              variant={showCompleted ? 'default' : 'outline'}
              onClick={() => setShowCompleted(!showCompleted)}
              className={`h-12 px-4 rounded-xl transition-all duration-300 ${
                showCompleted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-green-500 dark:hover:border-green-400'
              }`}
            >
              <CheckSquare className='h-4 w-4 mr-2' />
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </Button>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col items-center justify-center py-20'
            >
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6'>
                <CheckSquare className='h-10 w-10 text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
                {searchQuery || selectedPriority
                  ? 'No tasks found'
                  : 'No tasks yet'}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md'>
                {searchQuery || selectedPriority
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first task to get started with your productivity journey.'}
              </p>
              <Button
                onClick={handleCreateTask}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105'
              >
                <Plus className='h-4 w-4 mr-2' />
                Create Your First Task
              </Button>
            </motion.div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Task Editor Modal */}
      <TaskEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
