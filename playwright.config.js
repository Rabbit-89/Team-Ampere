import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5173" },
  webServer: [
    {
      command: "npm run api",
      url: "http://localhost:4000/healthz",
      reuseExistingServer: true,
      // Set environment variables for the API server
      env: { API_KEY: "e2e-test-key", API_URL: "http://localhost:4000" },
    },
    {
      command: "npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: true,
      env: { API_KEY: "e2e-test-key", API_URL: "http://localhost:4000" },
    },
  ],
});
