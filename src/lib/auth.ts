import { User, Session } from '@/types/auth';

const USERS_KEY = 'habit-tracker-users';
const SESSION_KEY = 'habit-tracker-session';

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data || data === 'null') return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function signUp(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }
  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  saveSession({ userId: user.id, email: user.email });
  return { success: true };
}

export function logIn(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  saveSession({ userId: user.id, email: user.email });
  return { success: true };
}

export function logOut(): void {
  saveSession(null);
}
