import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { Habit } from '@/types/habit';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  redirect: vi.fn(),
}));

function seedSession() {
  const user = {
    id: 'test-user-id',
    email: 'habit@example.com',
    password: 'pass',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
  localStorage.setItem(
    'habit-tracker-session',
    JSON.stringify({ userId: 'test-user-id', email: 'habit@example.com' })
  );
}

function seedHabit(overrides: Partial<Habit> = {}): Habit {
  const habit: Habit = {
    id: 'habit-seed-id',
    userId: 'test-user-id',
    name: 'Drink Water',
    description: 'Stay hydrated',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00.000Z',
    completions: [],
    ...overrides,
  };
  localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
  return habit;
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    seedSession();
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await screen.findByTestId('dashboard-page');
    await user.click(screen.getByTestId('create-habit-button'));
    await user.click(screen.getByTestId('habit-save-button'));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Habit name is required');
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await screen.findByTestId('dashboard-page');
    await user.click(screen.getByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Morning Run');
    await user.type(screen.getByTestId('habit-description-input'), 'Run 5k every morning');
    await user.click(screen.getByTestId('habit-save-button'));

    await screen.findByTestId('habit-card-morning-run');
    expect(screen.getByTestId('habit-card-morning-run')).toBeInTheDocument();

    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Morning Run');
    expect(habits[0].userId).toBe('test-user-id');
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();
    const original = seedHabit({ completions: ['2024-06-10'] });
    render(<DashboardPage />);

    await screen.findByTestId('habit-card-drink-water');
    await user.click(screen.getByTestId('habit-edit-drink-water'));

    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Drink More Water');
    await user.click(screen.getByTestId('habit-save-button'));

    await screen.findByTestId('habit-card-drink-more-water');

    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const updated = habits[0];
    expect(updated.id).toBe(original.id);
    expect(updated.userId).toBe(original.userId);
    expect(updated.createdAt).toBe(original.createdAt);
    expect(updated.completions).toEqual(original.completions);
    expect(updated.name).toBe('Drink More Water');
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup();
    seedHabit();
    render(<DashboardPage />);

    await screen.findByTestId('habit-card-drink-water');

    await user.click(screen.getByTestId('habit-delete-drink-water'));
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();

    await user.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-drink-water')).not.toBeInTheDocument();
    });

    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    expect(habits).toHaveLength(0);
  });

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();
    seedHabit();
    render(<DashboardPage />);

    await screen.findByTestId('habit-card-drink-water');

    const streakEl = screen.getByTestId('habit-streak-drink-water');
    expect(streakEl).toHaveTextContent('0');

    await user.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('1');
    });

    await user.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0');
    });
  });
});
