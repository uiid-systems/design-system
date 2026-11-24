#!/usr/bin/env node
// Checks that CI can publish every public @uiid/* package before a release
// tries to. Release publishes with npm trusted publishing (OIDC), and npm only
// lets a package trust a workflow once the package exists. So a package's
// first version, and its trust link to release.yml, are made by hand. When
// either is missed, `pnpm -r publish` fails with a 404 partway through and
// every package after it in publish order is left on the old version.
//
//   node packages/config/scripts/check-npm-publishing.mjs        read-only, no npm login
//   node packages/config/scripts/check-npm-publishing.mjs --fix  sets up what the check flags
//
// Who may publish is private to npm, so the read-only check looks for public
// evidence instead. A package passes when one of its versions was published
// through a GitHub trusted publisher, or when it carries the `bootstrap`
// dist-tag, which --fix adds only after the trust link is in place. The tag is
// left in place after the first CI publish; it is harmless.
//
// --fix needs `npm login` with 2FA, and asks before changing anything. For each
// package that fails the check it publishes an empty, deprecated placeholder
// if the name is not on npm, links the name to release.yml in REPO, then tags
// it `bootstrap`. Run it as `pnpm npm:bootstrap`. The repo is fixed here, never
// read from package.json, so a package cannot point its trust at another repo.

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const SCOPE = "@uiid/";
const REPO = "uiid-systems/design-system";
const WORKFLOW = "release.yml";
const MARKER_TAG = "bootstrap";
const PLACEHOLDER_VERSION = "0.0.0-bootstrap";
const REGISTRY = "https://registry.npmjs.org";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const packagesDir = join(root, "packages");
const fix = process.argv.includes("--fix");

const exit = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(packagesDir, entry.name, "package.json"))
  .filter((path) => existsSync(path))
  .map((path) => JSON.parse(readFileSync(path, "utf8")))
  // `pnpm -r publish` skips private packages, so they need no npm setup yet.
  .filter((pkg) => !pkg.private);

const outsideScope = packages.filter((pkg) => !pkg.name?.startsWith(SCOPE));
if (outsideScope.length > 0) {
  exit(
    `public packages outside ${SCOPE}: ${outsideScope.map((p) => p.name).join(", ")}`,
  );
}

// The Release job runs this after the tag is cut, so one slow or failed
// registry response should not fail a release on its own.
const fetchPackument = async (name) => {
  const url = `${REGISTRY}/${name.replace("/", "%2f")}`;
  for (let attempt = 1; ; attempt++) {
    let problem;
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status === 404) return null;
      if (response.ok) return response.json();
      problem = `registry answered ${response.status}`;
      // Only a server error or rate limit is worth asking again.
      if (response.status < 500 && response.status !== 429)
        exit(`${name}: ${problem}`);
    } catch (error) {
      problem = error.message;
    }
    if (attempt === 3) exit(`${name}: ${problem}`);
    await new Promise((done) => setTimeout(done, attempt * 2_000));
  }
};

const problemWith = (packument) => {
  if (!packument) return "not on npm";
  const versions = Object.values(packument.versions ?? {});
  if (versions.some((v) => v._npmUser?.trustedPublisher?.id === "github")) {
    return null;
  }
  if (packument["dist-tags"]?.[MARKER_TAG]) return null;
  return `no version published from CI and no \`${MARKER_TAG}\` tag`;
};

const results = await Promise.all(
  packages.map(async (pkg) => ({
    pkg,
    packument: await fetchPackument(pkg.name),
  })),
);
const failing = results
  .map((result) => ({ ...result, problem: problemWith(result.packument) }))
  .filter((result) => result.problem);

if (failing.length === 0) {
  console.log(
    `✓ npm publishing is set up for ${packages.length} public packages`,
  );
  process.exit(0);
}

const list = failing
  .map(({ pkg, problem }) => `  - ${pkg.name}: ${problem}`)
  .join("\n");

if (!fix) {
  console.error(`✗ CI cannot publish these packages yet:\n${list}`);
  console.error(
    "\nRun `npm login`, then `pnpm npm:bootstrap`, then re-run this check.",
  );
  process.exit(1);
}

const npm = (args, options = {}) => {
  console.log(`$ npm ${args.join(" ")}`);
  const result = spawnSync("npm", args, { stdio: "inherit", ...options });
  if (result.status !== 0) {
    exit(`npm ${args[0]} failed; nothing after it was run`);
  }
};

const npmVersion = spawnSync("npm", ["--version"], { encoding: "utf8" });
if (npmVersion.status !== 0) exit("npm is not on PATH");
const [major, minor] = npmVersion.stdout.trim().split(".").map(Number);
if (major < 11 || (major === 11 && minor < 15)) {
  exit(`npm trust needs npm 11.15 or later; this is npm ${npmVersion.stdout}`);
}

console.log(
  `These packages will trust ${REPO}/.github/workflows/${WORKFLOW}:\n${list}`,
);
const prompt = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const answer = await prompt.question("Continue? [y/N] ");
prompt.close();
if (answer.trim().toLowerCase() !== "y") exit("nothing changed");

for (const { pkg, packument } of failing) {
  console.log(`\n${pkg.name}`);

  if (!packument) {
    const dir = mkdtempSync(join(tmpdir(), "uiid-bootstrap-"));
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify(
        {
          name: pkg.name,
          version: PLACEHOLDER_VERSION,
          description: "Placeholder so CI can publish this package.",
          license: pkg.license,
          repository: { type: "git", url: `https://github.com/${REPO}` },
        },
        null,
        2,
      ),
    );
    try {
      npm(["publish", "--access", "public", "--tag", MARKER_TAG], { cwd: dir });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
    // npm points `latest` at a name's first version whatever the tag, so until
    // the first release, a plain install would get this empty package.
    npm([
      "deprecate",
      `${pkg.name}@${PLACEHOLDER_VERSION}`,
      "Placeholder; install a released version",
    ]);
  }

  // A package can already trust release.yml and still fail the check, when
  // no release has published it since. Adding the same link twice errors, so
  // a failed lookup stops here rather than being read as "no link".
  const listed = spawnSync("npm", ["trust", "list", pkg.name, "--json"], {
    encoding: "utf8",
  });
  if (listed.status !== 0) {
    console.error(listed.stderr);
    exit(`npm trust list ${pkg.name} failed`);
  }
  const link = listed.stdout.trim() ? JSON.parse(listed.stdout) : null;
  if (!link) {
    npm([
      "trust",
      "github",
      pkg.name,
      "--repo",
      REPO,
      "--file",
      WORKFLOW,
      "--allow-publish",
      "--yes",
    ]);
  } else if (
    link.type === "github" &&
    link.repository === REPO &&
    link.file === WORKFLOW
  ) {
    console.log(`  already trusts ${REPO}/${WORKFLOW}`);
  } else {
    exit(
      `${pkg.name} already trusts ${link.type} ${link.repository}/${link.file}; fix it on npmjs.com`,
    );
  }

  // Only now is the trust link in place, so only now does the tag go on.
  const tagged = packument?.["dist-tags"]?.latest ?? PLACEHOLDER_VERSION;
  npm(["dist-tag", "add", `${pkg.name}@${tagged}`, MARKER_TAG]);
}

console.log(
  `\n✓ set up ${failing.length} package(s); re-run the Release Preflight check on the release PR`,
);
