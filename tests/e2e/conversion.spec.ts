import { test, expect } from '@playwright/test';

test.describe('Conversion & Enrollment Flows', () => {
  
  test('Waitlist Flow: should show form and redirect on success when cohort is full', async ({ page }) => {
    await page.addInitScript(() => {
      const authState = {
        state: {
          user: { id: 'test-123', email: 'test@example.com', name: 'Test User', is_premium: false },
          isAuthenticated: true,
          _hasHydrated: true,
        },
        version: 0,
      };
      window.localStorage.setItem('auth-storage', JSON.stringify(authState));
    });

    await page.route('**/api/challenge/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { is_waitlist_only: true, spots_remaining: 0 }
        }),
      });
    });

    await page.route('**/api/cohorts/waitlist/join/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ position: 42 }),
      });
    });

    await page.goto('/subscribe');
    await page.waitForLoadState('networkidle');
    
    // Ensure the app is hydrated and user is authenticated
    await page.waitForFunction(() => {
      return window.localStorage.getItem('auth-storage') !== null;
    });

    await page.locator('#plan-card-challenge button').click();
    await expect(page.getByText('Ku biir liiska sugitaanka')).toBeVisible({ timeout: 10000 });
    
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('input[id="whatsapp"]', '+252612345678');
    await page.click('button:has-text("Ku biir liiska sugitaanka")');

    await expect(page).toHaveURL(/\/waitlist-confirmed\?position=42/);
    await expect(page.getByText('42')).toBeVisible();
  });


    await page.route('**/api/challenge/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { is_waitlist_only: true, spots_remaining: 0 }
        }),
      });
    });

    await page.route('**/api/cohorts/waitlist/join/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ position: 42 }),
      });
    });

    const responsePromise = page.waitForResponse(res => res.url().includes('/api/challenge/status') && res.status() === 200);
    await page.goto('/subscribe');
    await responsePromise;
    await page.waitForLoadState('networkidle');
    
    await page.locator('#plan-card-challenge button').click();
    await expect(page.getByText('Ku biir liiska sugitaanka')).toBeVisible({ timeout: 10000 });
    
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('input[id="whatsapp"]', '+252612345678');
    await page.click('button:has-text("Ku biir liiska sugitaanka")');

    await expect(page).toHaveURL(/\/waitlist-confirmed\?position=42/);
    await expect(page.getByText('42')).toBeVisible();
  });

  test('Signup to Payment Bridge: should set referrer on mentorship page', async ({ page }) => {
    await page.goto('/mentorship');
    await page.click('text=Ku biir Challenge-ka');
    
    const referrer = await page.evaluate(() => localStorage.getItem('garaad_signup_referrer'));
    expect(referrer).toBe('mentorship');
  });

  test('Cohort Status Banner: should show different states based on spots', async ({ page }) => {
    const scenarios = [
      { spots: 5, expectedText: '5 boosas ayaa hadhay' },
      { spots: 1, expectedText: 'Kaliya 1 boos ayaa hadhay' },
      { spots: 0, isWaitlist: true, expectedText: 'Cohort-ka waa buuxsamay' },
    ];

    for (const scenario of scenarios) {
      await page.route('**/api/challenge/status', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { 
              is_waitlist_only: scenario.isWaitlist || false, 
              spots_remaining: scenario.spots 
            },
          }),
        });
      });

      await page.goto('/mentorship');
      await expect(page.getByText(scenario.expectedText)).toBeVisible();
    }
  });

  test('Payment Guard: should show WaitlistForm instead of PaymentModal when cohort is full', async ({ page }) => {
    await page.addInitScript(() => {
      const authState = {
        state: {
          user: { id: 'test-123', email: 'test@example.com', name: 'Test User', is_premium: false },
          isAuthenticated: true,
          _hasHydrated: true,
        },
        version: 0,
      };
      window.localStorage.setItem('auth-storage', JSON.stringify(authState));
    });

    await page.route('**/api/challenge/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { is_waitlist_only: true },
        }),
      });
    });

    const responsePromise = page.waitForResponse(res => res.url().includes('/api/challenge/status') && res.status() === 200);
    await page.goto('/subscribe');
    await responsePromise;
    await page.waitForLoadState('networkidle');
    
    await page.locator('#plan-card-challenge button').click();

    await expect(page.getByText('Ku biir liiska sugitaanka')).toBeVisible();
    await expect(page.locator('button:has-text("Bixi $49 maanta")')).not.toBeVisible();
  });
});
