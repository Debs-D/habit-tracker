import { Habit } from '@/types/habit';

const HABITS_KEY = 'habit-tracker-habits';

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HABITS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function getUserHabits(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}

export function addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>): Habit {
  const newHabit: Habit = {
    ...habit,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    completions: [],
  };
  saveHabits([...getHabits(), newHabit]);
  return newHabit;
}

export function updateHabit(updated: Habit): void {
  saveHabits(getHabits().map((h) => (h.id === updated.id ? updated : h)));
}

export function removeHabit(id: string): void {
  saveHabits(getHabits().filter((h) => h.id !== id));
}
