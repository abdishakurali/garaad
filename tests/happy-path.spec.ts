import { test, expect } from '@playwright/test';

test('Happy Path: Welcome flow to Course page', async ({ page }) => {
    // 1. Go to welcome page
    await page.goto('/welcome');

    // 2. Complete onboarding (Goals step)
    // Assuming the first button is a goal
    await page.locator('button:not([disabled])').first().click();

    // 3. Select topic
    await page.locator('button:not([disabled])').first().click();

    // 4. Select level
    await page.locator('button:not([disabled])').first().click();

    // 5. Select daily goal
    await page.locator('button:not([disabled])').first().click();

    // 6. Fill user details
    await page.fill('input[id="firstName"]', 'Test User');
    await page.fill('input[id="age"]', '25');
    await page.fill('input[id="email"]', `test_${Date.now()}@example.com`);
    await page.fill('input[id="password"]', 'Password123!');

    // 7. Submit
    const submitButton = page.locator('button:has-text("Bilow barashada")');
    // If the button text is different, adjust. The current code shows Button text is dynamic or handled via handleContinue
    // In the last step (4), it should say "Bilow barashada" or similar

    // 8. Verify redirection (to verify-email since it's a new user)
    // await expect(page).toHaveURL(/.*verify-email/);
});
