import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  // Slidev dev server syncs navigation across all open pages; run serially
  workers: 1,
  fullyParallel: false,
  use: { baseURL: 'http://localhost:3030' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3030',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
