'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logOut } from '@/lib/auth';
import { getUserHabits, addHabit, updateHabit, removeHabit } from '@/lib/storage';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';
import { Session } from '@/types/auth';
import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [loaded, setLoaded] = useState(false);
  const today = getToday();

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push('/login');
      return;
    }
    setSession(s);
    setHabits(getUserHabits(s.userId));
    setLoaded(true);
  }, [router]);

  const handleSave = (data: { name: string; description: string; frequency: 'daily' }) => {
    if (!session) return;
    if (editingHabit) {
      const updated: Habit = {
        ...editingHabit,
        name: data.name,
        description: data.description,
      };
      updateHabit(updated);
    } else {
      addHabit({ ...data, userId: session.userId });
    }
    setHabits(getUserHabits(session.userId));
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!session) return;
    removeHabit(id);
    setHabits(getUserHabits(session.userId));
  };

  const handleToggle = (habit: Habit) => {
    if (!session) return;
    const updated = toggleHabitCompletion(habit, today);
    updateHabit(updated);
    setHabits(getUserHabits(session.userId));
  };

  const handleLogout = () => {
    logOut();
    router.push('/login');
  };

  const handleShowCreate = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  if (!loaded) return null;

  const completedToday = habits.filter((h) => h.completions.includes(today)).length;
  const firstName = session?.email?.split('@')[0] ?? '';

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="px-4 pt-10 pb-6"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)' }}
      >
        <div className="mx-auto max-w-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-sm">{getDayGreeting()},</p>
              <h1 className="text-xl font-bold text-white capitalize">{firstName}</h1>
            </div>
            <button
              type="button"
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="mt-0.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Sign out
            </button>
          </div>

          {/* Stats pill */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <span className="text-white text-sm font-semibold">{completedToday}</span>
            <span className="text-indigo-200 text-sm">of</span>
            <span className="text-white text-sm font-semibold">{habits.length}</span>
            <span className="text-indigo-200 text-sm">habits done today</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-lg px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-gray-400">{formatDate(today)}</p>
          {!showForm && (
            <button
              type="button"
              data-testid="create-habit-button"
              onClick={handleShowCreate}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.97] transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New habit
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-4">
            <HabitForm
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingHabit(null); }}
              editingHabit={editingHabit}
            />
          </div>
        )}

        {habits.length === 0 && !showForm ? (
          <div
            data-testid="empty-state"
            className="mt-12 flex flex-col items-center text-center px-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-base font-semibold text-gray-800">No habits yet</h2>
            <p className="mt-1 text-sm text-gray-500 max-w-xs">
              Hit &ldquo;New habit&rdquo; to add your first one and start building your streak.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
