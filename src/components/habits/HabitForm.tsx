'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

interface HabitFormProps {
  onSave: (data: { name: string; description: string; frequency: 'daily' }) => void;
  onCancel: () => void;
  editingHabit?: Habit | null;
}

export default function HabitForm({ onSave, onCancel, editingHabit }: HabitFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description);
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [editingHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);
    onSave({ name: validation.value, description: description.trim(), frequency: 'daily' });
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="rounded-2xl bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
          <h2 className="text-lg font-bold text-gray-900">
            {editingHabit ? 'Edit habit' : 'Create new habit'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        <div>
          <label htmlFor="habit-name" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Habit name <span className="text-red-500 normal-case font-normal tracking-normal">*</span>
          </label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="habit-name-input"
            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none hover:border-gray-300"
            placeholder="e.g., Morning meditation, 10k steps, Read daily"
          />
          {error && (
            <p role="alert" className="mt-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="habit-description" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Notes <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span>
          </label>
          <textarea
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid="habit-description-input"
            rows={3}
            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none hover:border-gray-300 resize-none"
            placeholder="Add motivation, tips, or a goal..."
          />
        </div>
      </div>

          <label htmlFor="habit-frequency" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Frequency
          </label>
          <div className="relative">
            <select
              id="habit-frequency"
              data-testid="habit-frequency-select"
              value="daily"
              onChange={() => {}}
              tabIndex={-1}
              className="block w-full rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100/50 px-4 py-3 text-sm font-semibold text-indigo-700 cursor-default focus:outline-none"
              style={{ appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="daily"> Daily — every single day</option>

            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <span className="text-xs font-medium text-indigo-500 bg-white/60 rounded-full px-2 py-0.5">active</span>
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>


      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {editingHabit ? 'Save changes' : 'Add habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 rounded-xl border-2 border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
