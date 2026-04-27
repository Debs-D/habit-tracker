import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  redirect: vi.fn(),
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'alice@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'securepass123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    expect(session).not.toBeNull();
    expect(session.email).toBe('alice@example.com');
    expect(session.userId).toBeTruthy();

    const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('alice@example.com');
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();
    const existingUsers = [
      {
        id: 'existing-id',
        email: 'taken@example.com',
        password: 'pass',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('habit-tracker-users', JSON.stringify(existingUsers));

    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'taken@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'anypassword');
    await user.click(screen.getByTestId('auth-signup-submit'));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('User already exists');

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    expect(session).toBeNull();
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();
    const users = [
      {
        id: 'user-abc',
        email: 'bob@example.com',
        password: 'mypassword',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('habit-tracker-users', JSON.stringify(users));

    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'bob@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'mypassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    expect(session).not.toBeNull();
    expect(session.userId).toBe('user-abc');
    expect(session.email).toBe('bob@example.com');
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Invalid email or password');

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    expect(session).toBeNull();
  });
});
