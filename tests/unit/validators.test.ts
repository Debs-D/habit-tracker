import { describe, it, expect } from 'vitest';
import { validateHabitName } from '@/lib/validators';

describe('validateHabitName', () => {
  it('returns an error when habit name is empty', () => {
    const emptyResult = validateHabitName('');
    expect(emptyResult.valid).toBe(false);
    expect(emptyResult.error).toBe('Habit name is required');

    const spacesResult = validateHabitName('   ');
    expect(spacesResult.valid).toBe(false);
    expect(spacesResult.error).toBe('Habit name is required');
  });

  it('returns an error when habit name exceeds 60 characters', () => {
    const longName = 'a'.repeat(61);
    const result = validateHabitName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name must be 60 characters or fewer');

    const exactlyLimit = 'a'.repeat(60);
    const limitResult = validateHabitName(exactlyLimit);
    expect(limitResult.valid).toBe(true);
    expect(limitResult.error).toBeNull();
  });

  it('returns a trimmed value when habit name is valid', () => {
    const result = validateHabitName('  Drink Water  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Drink Water');
    expect(result.error).toBeNull();

    const simpleResult = validateHabitName('Exercise');
    expect(simpleResult.valid).toBe(true);
    expect(simpleResult.value).toBe('Exercise');
  });
});
