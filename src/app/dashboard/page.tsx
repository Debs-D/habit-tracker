'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
      updateHabit({ ...editingHabit, name: data.name, description: data.description });
      toast.success('Habit updated', { description: `"${data.name}" has been saved.` });
    } else {
      addHabit({ ...data, userId: session.userId });
      toast.success('Habit created', { description: `"${data.name}" added to your list.` });
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
    const deleted = habits.find((h) => h.id === id);
    removeHabit(id);
    setHabits(getUserHabits(session.userId));
    if (deleted) toast.error('Habit deleted', { description: `"${deleted.name}" has been removed.` });
  };

  const handleToggle = (habit: Habit) => {
    if (!session) return;
    const updated = toggleHabitCompletion(habit, today);
    updateHabit(updated);
    setHabits(getUserHabits(session.userId));
    const nowDone = updated.completions.includes(today);
    if (nowDone) {
      toast.success(`"${habit.name}" done!`, { description: 'Keep the streak going!' });
    } else {
      toast(`Unmarked "${habit.name}"`, { description: 'Completion removed for today.' });
    }
  };

  const handleLogout = () => {
    logOut();
    router.push('/login');
  };

  if (!loaded) return null;

  const completedToday = habits.filter((h) => h.completions.includes(today)).length;
  const firstName = session?.email?.split('@')[0] ?? '';

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header
        className="px-5 pt-10 pb-7"
        style={{ background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)' }}
      >
        <div className="mx-auto max-w-lg">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-indigo-300 text-sm">{getDayGreeting()},</p>
              <h1 className="text-2xl font-bold text-white capitalize mt-0.5">{firstName}</h1>
            </div>
            <button
              type="button"
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="mt-1 rounded-xl border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Log out
            </button>
          </div>

          {/* Stats pill — only show when habits exist */}
          {habits.length > 0 && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5">
              <span className="text-white font-bold text-sm">{completedToday}</span>
              <span className="text-indigo-200 text-sm">of</span>
              <span className="text-white font-bold text-sm">{habits.length}</span>
              <span className="text-indigo-200 text-sm">
                {completedToday === habits.length ? 'done — great work! 🎉' : 'habits done today'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-lg px-4 py-5">

        {/* Date row + New habit button */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-gray-400">{formatDate(today)}</p>
          {!showForm && (
            <button
              type="button"
              data-testid="create-habit-button"
              onClick={() => { setEditingHabit(null); setShowForm(true); }}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              + New habit
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-4">
            <HabitForm
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingHabit(null); }}
              editingHabit={editingHabit}
            />
          </div>
        )}

        {/* Empty state */}
        {habits.length === 0 && !showForm && (
          <div
            data-testid="empty-state"
            className="mt-16 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 text-3xl">
              📋
            </div>
            <h2 className="text-base font-bold text-gray-800">No habits yet</h2>
            <p className="mt-1.5 text-sm text-gray-500 max-w-xs leading-relaxed">
              Click &ldquo;+ New habit&rdquo; to add your first one and start building your streak.
            </p>
          </div>
        )}

        {/* Habit list */}
        {habits.length > 0 && (
          <div className="space-y-3">
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
