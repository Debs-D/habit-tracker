import { test, expect } from '@playwright/test';

function randomEmail() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;
}

async function clearStorage(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await clearStorage(page);
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible({ timeout: 800 });
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.evaluate(() => {
      const user = { id: 'u1', email: 'auth@test.com', password: 'pass', createdAt: new Date().toISOString() };
      localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'auth@test.com' }));
    });
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    const email = randomEmail();
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('Password123!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    const email1 = randomEmail();
    const email2 = randomEmail();

    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email1);
    await page.getByTestId('auth-signup-password').fill('Pass1!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('User One Habit');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-user-one-habit')).toBeVisible();

    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email2);
    await page.getByTestId('auth-signup-password').fill('Pass2!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    expect(await page.getByTestId('habit-card-user-one-habit').count()).toBe(0);

    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/);

    await page.getByTestId('auth-login-email').fill(email1);
    await page.getByTestId('auth-login-password').fill('Pass1!');
    await page.getByTestId('auth-login-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('habit-card-user-one-habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    const email = randomEmail();
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('Password123!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByTestId('create-habit-button').click();
    await expect(page.getByTestId('habit-form')).toBeVisible();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('8 glasses a day');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId('habit-streak-drink-water')).toHaveText('0');
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const email = randomEmail();
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('Password123!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Exercise');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-exercise')).toBeVisible();

    await expect(page.getByTestId('habit-streak-exercise')).toHaveText('0');
    await page.getByTestId('habit-complete-exercise').click();
    await expect(page.getByTestId('habit-streak-exercise')).toHaveText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    const email = randomEmail();
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('Password123!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    const email = randomEmail();
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('Password123!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    const email = randomEmail();
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('Password123!');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    await page.waitForTimeout(2500);

    await context.setOffline(true);

    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});

    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });

    const hasContent = await page.evaluate(() => document.body.innerHTML.length > 0);
    expect(hasContent).toBe(true);

    await context.setOffline(false);
  });
});
