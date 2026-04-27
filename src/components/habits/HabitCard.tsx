'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

interface HabitCardProps {
  habit: Habit;
  today: string;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggle: (habit: Habit) => void;
}

export default function HabitCard({ habit, today, onEdit, onDelete, onToggle }: HabitCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`group rounded-2xl border bg-white transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white'
          : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1'
      }`}
    >
      <div className="flex items-center gap-4 p-5">

        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          aria-label={isCompleted ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
          className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${
            isCompleted
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200 focus:ring-emerald-400'
              : 'bg-gray-50 border-2 border-gray-200 text-gray-300 hover:border-indigo-300 hover:text-indigo-400 hover:bg-indigo-50 focus:ring-indigo-300'
          }`}
        >
          {isCompleted ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-base leading-tight ${
            isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
          }`}>
            {habit.name}
          </p>
          {habit.description && (
            <p className={`mt-1 text-sm truncate ${
              isCompleted ? 'text-gray-300 line-through' : 'text-gray-500'
            }`}>
              {habit.description}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">

          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            streak > 0 ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-400 border border-gray-100'
          }`}>
            <span className="text-sm">{streak > 0 ? '🔥' : '📅'}</span>
            <span data-testid={`habit-streak-${slug}`} className="font-bold">{streak}</span>
            <span className="font-normal">{streak === 1 ? 'day' : 'days'}</span>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              data-testid={`habit-edit-${slug}`}
              onClick={() => onEdit(habit)}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all"
            >
              Edit
            </button>
            <span className="text-gray-200 text-xs">•</span>
            <button
              type="button"
              data-testid={`habit-delete-${slug}`}
              onClick={() => setConfirmingDelete(true)}
              className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {confirmingDelete && (
        <div className="mx-5 mb-5 rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white px-5 py-4 shadow-sm">
          <p className="text-sm text-red-800 font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete &ldquo;{habit.name}&rdquo;?
          </p>
          <p className="text-xs text-red-600 mb-4">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all shadow-md shadow-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}