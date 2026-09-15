import { defineConfig } from "@playwright/test";

// 127.0.0.1, not localhost. In the devcontainer /etc/hosts maps localhost to
// both 127.0.0.1 and ::1; Node resolves verbatim and binds `serve` to ::1 only,
// which Chromium reaches but Node's fetch (accessibility.spec.ts) does not.
const baseURL = process.env.BASE_URL || "http://127.0.0.1:1313";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  // The HTML report is served on a fixed port so the devcontainer can forward it
  // (9323 in .devcontainer/devcontainer.json); the default picks a free port,
  // which a forward cannot follow. host 0.0.0.0 rather than the default
  // localhost so the forward reaches it from outside the container, and
  // open "never" because there is no browser in here to launch - view it with
  // `make report`.
  reporter: [["list"], ["html", { host: "0.0.0.0", port: 9323, open: "never" }]],
  use: {
    baseURL,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npx serve docs/public -l tcp://127.0.0.1:1313 --no-clipboard",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
