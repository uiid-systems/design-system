// @vitest-environment node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// The check reads the real repo, so this runs it as CI does and asserts the
// packages it exempts (config and recipes) are not reported.
describe("check-package-registration", () => {
  const script = fileURLToPath(
    new URL("./check-package-registration.mjs", import.meta.url),
  );
  const result = spawnSync(process.execPath, [script], { encoding: "utf8" });

  it("passes on the repo as it is", () => {
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  });

  it("does not treat the private recipes package as a component package", () => {
    expect(`${result.stdout}${result.stderr}`).not.toContain("@uiid/recipes");
  });
});
