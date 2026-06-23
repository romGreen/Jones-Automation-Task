import { defineConfig, devices } from '@playwright/test';

// Playwright Test configuration.
// Runs against the assignment site in headless Chromium by default.
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'https://test.netlify.app',
    headless: true,
    // Keep debugging artifacts only when something actually fails.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
