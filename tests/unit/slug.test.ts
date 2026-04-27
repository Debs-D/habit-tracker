import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
    expect(getHabitSlug('Read Books')).toBe('read-books');
    expect(getHabitSlug('Morning Run')).toBe('morning-run');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Drink Water  ')).toBe('drink-water');
    expect(getHabitSlug('hello   world')).toBe('hello-world');
    expect(getHabitSlug('  multiple   spaces   here  ')).toBe('multiple-spaces-here');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Drink!!! Water')).toBe('drink-water');
    expect(getHabitSlug('Push-ups')).toBe('push-ups');
    expect(getHabitSlug('Hello@World')).toBe('helloworld');
    expect(getHabitSlug('Test (habit)')).toBe('test-habit');
  });
});
