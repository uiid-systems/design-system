import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

import root from "./vitest.config.ts";

/* Runs `*.browser.test.tsx` files in a real browser, for what happy-dom cannot
   show: caret movement, real clipboard paste and the browser's own editing.
   `pnpm test:run` stays on happy-dom and leaves these out; run them with
   `pnpm test:browser`.

   Chromium by default, which is what CI runs. Point it at other engines with
   `VITEST_BROWSERS`, for example `VITEST_BROWSERS=firefox,webkit`, once
   `playwright install firefox webkit` has put their binaries on the machine. */
const browsers = (process.env.VITEST_BROWSERS ?? "chromium")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean) as ("chromium" | "firefox" | "webkit")[];

/* Shares the root config's resolution, setup and global setup. Its happy-dom
   environment and its exclusion of these very files are left behind. */
const {
  environment: _environment,
  exclude: _exclude,
  ...shared
} = root.test ?? {};

export default defineConfig({
  ...root,
  test: {
    ...shared,
    name: "browser",
    include: ["packages/**/*.browser.test.tsx"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: browsers.map((browser) => ({ browser })),
      // Nothing uploads them, so a failure would only leave untracked files.
      screenshotFailures: false,
    },
  },
});
