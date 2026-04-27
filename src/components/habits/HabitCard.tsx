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
    <>
      {/* ── Card ── */}
      <div
        data-testid={`habit-card-${slug}`}
        className={`rounded-2xl border bg-white transition-all duration-200 ${
          isCompleted
            ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white'
            : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-center gap-4 p-5">

          {/* Complete toggle */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <button
              type="button"
              data-testid={`habit-complete-${slug}`}
              onClick={() => onToggle(habit)}
              aria-label={isCompleted ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${
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
                  <circle cx="12" cy="12" r="9" />
                </svg>
              )}
            </button>
            <span className={`text-[10px] font-semibold leading-none ${
              isCompleted ? 'text-emerald-500' : 'text-gray-400'
            }`}>
              {isCompleted ? 'Done' : 'Mark'}
            </span>
          </div>

          {/* Name + description */}
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

          {/* Right: streak + actions */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            {/* Streak badge */}
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              streak > 0
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200'
                : 'bg-gray-50 text-gray-400 border border-gray-100'
            }`}>
              <span className="text-sm">{streak > 0 ? '🔥' : '○'}</span>
              <span data-testid={`habit-streak-${slug}`} className="font-bold">{streak}</span>
              <span className="font-normal">{streak === 1 ? 'day' : 'days'}</span>
            </div>

            {/* Edit / Delete — always visible */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                data-testid={`habit-edit-${slug}`}
                onClick={() => onEdit(habit)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Edit
              </button>
              <span className="text-gray-200 text-xs">•</span>
              <button
                type="button"
                data-testid={`habit-delete-${slug}`}
                onClick={() => setConfirmingDelete(true)}
                className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Delete modal ── */}
      {confirmingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 15, 30, 0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setConfirmingDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            {/* Copy */}
            <h3 id="delete-modal-title" className="text-center text-base font-bold text-gray-900 mb-1">
              Delete habit?
            </h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              &ldquo;{habit.name}&rdquo; and all its history will be permanently removed.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="confirm-delete-button"
                onClick={() => { onDelete(habit.id); setConfirmingDelete(false); }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition shadow-sm shadow-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}