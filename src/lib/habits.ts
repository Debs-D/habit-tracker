import { Habit } from '@/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = habit.completions.includes(date)
    ? habit.completions.filter((d) => d !== date)
    : Array.from(new Set([...habit.completions, date]));

  return { ...habit, completions };
}
