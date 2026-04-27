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
      className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          {editingHabit ? 'Edit habit' : 'New habit'}
        </h2>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">Daily</span>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="habit-name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Name <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="habit-name-input"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            placeholder="e.g. Drink 8 glasses of water"
          />
          {error && (
            <p role="alert" className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
          )}
        </div>

        <div>
          <label htmlFor="habit-description" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Notes <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </label>
          <input
            id="habit-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid="habit-description-input"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            placeholder="Add a short note or goal"
          />
        </div>

        <div>
          <label htmlFor="habit-frequency" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            readOnly
            aria-readonly="true"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 focus:outline-none cursor-default"
          >
            <option value="daily">Every day</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {editingHabit ? 'Save changes' : 'Add habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
