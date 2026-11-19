#!/usr/bin/env node
// Checks that CI can publish every public @uiid/* package before a release
// tries to. Release publishes with npm trusted publishing (OIDC), and npm only
// lets a package trust a workflow once the package exists. So a package's
// first version, and its trust link to release.yml, are made by hand. When
// either is missed, `pnpm -r publish` fails with a 404 partway through and
// every package after it in publish order is left on the old version.
//
//   node scripts/check-npm-publishing.mjs        read-only, no npm login
//   node scripts/check-npm-publishing.mjs --fix  sets up what the check flags
//
// Who may publish is private to npm, so the read-only check looks for public
// evidence instead. A package passes when one of its versions was published by
// GitHub Actions through OIDC, or when it carries the `bootstrap` dist-tag,
// which --fix adds only after the trust link is in place.
//
// --fix needs `npm login` with 2FA. For each package that fails the check it
// publishes an empty placeholder if the name is not on npm, links the name to
// release.yml, then tags it `bootstrap`. Run it as `pnpm npm:bootstrap`.

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
import { fileURLToPath } from "node:url";

const WORKFLOW = "release.yml";
const OIDC_PUBLISHER = "npm-oidc-no-reply@github.com";
const MARKER_TAG = "bootstrap";
const PLACEHOLDER_VERSION = "0.0.0-bootstrap";
const REGISTRY = "https://registry.npmjs.org";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = join(root, "packages");
const fix = process.argv.includes("--fix");

const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(packagesDir, entry.name, "package.json"))
  .filter((path) => existsSync(path))
  .map((path) => JSON.parse(readFileSync(path, "utf8")))
  // `pnpm -r publish` skips private packages, so they need no npm setup yet.
  .filter((pkg) => !pkg.private);

const fetchPackument = async (name) => {
  const response = await fetch(`${REGISTRY}/${name.replace("/", "%2f")}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`${name}: registry answered ${response.status}`);
  }
  return response.json();
};

const problemWith = (packument) => {
  if (!packument) return "not on npm";
  const versions = Object.values(packument.versions ?? {});
  if (versions.some((v) => v._npmUser?.email === OIDC_PUBLISHER)) return null;
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

if (!fix) {
  console.error(
    `✗ CI cannot publish these packages yet:\n${failing
      .map(({ pkg, problem }) => `  - ${pkg.name}: ${problem}`)
      .join("\n")}`,
  );
  console.error(
    `\nRun \`npm login\`, then \`pnpm npm:bootstrap\`, then re-run this check.`,
  );
  process.exit(1);
}

const npm = (args, options = {}) => {
  console.log(`$ npm ${args.join(" ")}`);
  const result = spawnSync("npm", args, { stdio: "inherit", ...options });
  if (result.status !== 0) {
    console.error(`✗ npm ${args[0]} failed; nothing after it was run`);
    process.exit(result.status ?? 1);
  }
};

const npmVersion = spawnSync("npm", ["--version"], {
  encoding: "utf8",
}).stdout.trim();
const [major, minor] = npmVersion.split(".").map(Number);
if (major < 11 || (major === 11 && minor < 15)) {
  console.error(
    `✗ npm trust needs npm 11.15 or later; this is npm ${npmVersion}`,
  );
  process.exit(1);
}

for (const { pkg, packument } of failing) {
  console.log(`\n${pkg.name}`);
  const repo = new URL(pkg.repository.url).pathname.replace(/^\/|\.git$/g, "");

  if (!packument) {
    const dir = mkdtempSync(join(tmpdir(), "uiid-bootstrap-"));
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify(
        {
          name: pkg.name,
          version: PLACEHOLDER_VERSION,
          description:
            "Placeholder so CI can publish this package. Install a real version.",
          license: pkg.license,
          repository: pkg.repository,
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
  }

  // A package can already trust release.yml and still fail the check, when
  // no release has published it since. Adding the same link twice errors.
  const listed = spawnSync("npm", ["trust", "list", pkg.name, "--json"], {
    encoding: "utf8",
  });
  const links =
    listed.status === 0 && listed.stdout.trim()
      ? [JSON.parse(listed.stdout)].flat()
      : [];
  const trusted = links.some(
    (link) =>
      link.type === "github" &&
      link.repository === repo &&
      link.file === WORKFLOW,
  );
  if (trusted) {
    console.log(`  already trusts ${repo}/${WORKFLOW}`);
  } else {
    npm([
      "trust",
      "github",
      pkg.name,
      "--repo",
      repo,
      "--file",
      WORKFLOW,
      "--allow-publish",
      "--yes",
    ]);
  }

  // Only now is the trust link in place, so only now does the tag go on.
  const tagged = packument?.["dist-tags"]?.latest ?? PLACEHOLDER_VERSION;
  npm(["dist-tag", "add", `${pkg.name}@${tagged}`, MARKER_TAG]);
}

console.log(
  `\n✓ set up ${failing.length} package(s); the next release publishes them from CI`,
);
