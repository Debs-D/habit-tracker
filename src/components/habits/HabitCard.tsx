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
      className={`rounded-2xl border bg-white transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-200 shadow-sm shadow-emerald-50'
          : 'border-gray-200 shadow-sm card-lift'
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Completion toggle */}
        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          aria-label={isCompleted ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
          className={`check-circle flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            isCompleted
              ? 'border-emerald-500 bg-emerald-500 text-white focus:ring-emerald-400'
              : 'border-gray-300 bg-white text-transparent hover:border-indigo-400 focus:ring-indigo-400'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-5 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {habit.name}
          </p>
          {habit.description && (
            <p className="mt-0.5 text-xs text-gray-400 truncate">{habit.description}</p>
          )}
        </div>

        {/* Streak display */}
        <div
          className={`streak-badge flex-shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            streak > 0
              ? 'bg-amber-50 text-amber-700'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <span aria-hidden="true">{streak > 0 ? '🔥' : '○'}</span>
          <span data-testid={`habit-streak-${slug}`}>{streak}</span>
        </div>

        {/* Edit / Delete */}
        <div className="flex-shrink-0 flex gap-0.5">
          <button
            type="button"
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            aria-label={`Edit ${habit.name}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmingDelete(true)}
            aria-label={`Delete ${habit.name}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmingDelete && (
        <div className="mx-4 mb-4 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3">
          <p className="text-xs text-red-700 font-medium mb-2.5">
            Remove &ldquo;{habit.name}&rdquo; permanently?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Yes, remove
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
