#!/usr/bin/env npx tsx
/**
 * rebrand.ts
 *
 * Renames all references to "uiid" throughout the codebase and resets
 * project history for a clean start.
 *
 * See docs/architecture/rebrand-script.md for full documentation.
 *
 * Usage:
 *   npx tsx scripts/rebrand.ts --scope acme
 *   npx tsx scripts/rebrand.ts --scope acme --org acme-labs --dry-run
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// ── Types ────────────────────────────────────────────────────────────

type Rule = {
	name: string;
	find: string | RegExp;
	replace: string;
	extensions: string[];
};

type Args = {
	scope: string;
	prefix: string;
	org: string;
	repo: string;
	version: string;
	dryRun: boolean;
	skipGit: boolean;
	skipInstall: boolean;
};

type Stats = {
	filesScanned: number;
	filesModified: number;
	replacements: number;
	ruleHits: Record<string, number>;
};

// ── ANSI colors ──────────────────────────────────────────────────────

const c = {
	green: (s: string) => `\x1b[32m${s}\x1b[0m`,
	red: (s: string) => `\x1b[31m${s}\x1b[0m`,
	yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
	cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
	dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
	bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

// ── Argument parsing ─────────────────────────────────────────────────

function parseArgs(): Args {
	const argv = process.argv.slice(2);

	const get = (flag: string): string | undefined => {
		const idx = argv.indexOf(flag);
		return idx !== -1 && idx + 1 < argv.length ? argv[idx + 1] : undefined;
	};
	const has = (flag: string): boolean => argv.includes(flag);

	const scope = get("--scope");
	if (!scope) {
		console.error(c.red("Error: --scope is required\n"));
		console.error("Usage: npx tsx scripts/rebrand.ts --scope <name>\n");
		console.error("Options:");
		console.error("  --scope <name>       New npm scope (required)");
		console.error(
			"  --prefix <name>      CSS layer prefix (default: same as scope)",
		);
		console.error(
			"  --org <name>         GitHub org (default: {scope}-systems)",
		);
		console.error(
			"  --repo <name>        GitHub repo name (default: design-system)",
		);
		console.error("  --version <ver>      Reset version (default: 0.0.1)");
		console.error("  --dry-run            Preview without writing");
		console.error("  --skip-git           Skip git history reset");
		console.error("  --skip-install       Skip pnpm install");
		process.exit(1);
	}

	if (!/^[a-z][a-z0-9-]*$/.test(scope)) {
		console.error(
			c.red(
				"Error: scope must be lowercase, start with a letter, and contain only letters, numbers, and hyphens",
			),
		);
		process.exit(1);
	}

	if (scope.length < 2 || scope.length > 20) {
		console.error(c.red("Error: scope must be 2-20 characters"));
		process.exit(1);
	}

	return {
		scope,
		prefix: get("--prefix") ?? scope,
		org: get("--org") ?? `${scope}-systems`,
		repo: get("--repo") ?? "design-system",
		version: get("--version") ?? "0.0.1",
		dryRun: has("--dry-run"),
		skipGit: has("--skip-git"),
		skipInstall: has("--skip-install"),
	};
}

// ── Utilities ────────────────────────────────────────────────────────

function toCamelCase(s: string): string {
	return s.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

// ── File discovery ───────────────────────────────────────────────────

const EXCLUDE_DIRS = new Set([
	"node_modules",
	"dist",
	".git",
	".next",
	".turbo",
	".vercel",
]);

const EXCLUDE_FILES = new Set(["pnpm-lock.yaml"]);

const TARGET_EXTENSIONS = new Set([
	".ts",
	".tsx",
	".js",
	".jsx",
	".cjs",
	".mjs",
	".json",
	".css",
	".md",
]);

// Files the script should never modify
const SELF_EXCLUDE = new Set([
	path.join(ROOT, "scripts/rebrand.ts"),
	path.join(ROOT, "scripts/onboard.ts"),
	path.join(ROOT, "docs/architecture/rebrand-script.md"),
]);

function discoverFiles(dir: string): string[] {
	const results: string[] = [];

	function walk(currentDir: string) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name);
			if (entry.isDirectory()) {
				if (!EXCLUDE_DIRS.has(entry.name)) walk(fullPath);
			} else if (entry.isFile()) {
				if (EXCLUDE_FILES.has(entry.name)) continue;
				if (SELF_EXCLUDE.has(fullPath)) continue;
				if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
					results.push(fullPath);
				}
			}
		}
	}

	walk(dir);
	return results;
}

// ── Rule definitions ─────────────────────────────────────────────────

function buildRules(args: Args): Rule[] {
	const scopeCamel = toCamelCase(args.scope);

	return [
		// 1. Package scope — most specific, applied first
		{
			name: "package-scope",
			find: "@uiid/",
			replace: `@${args.scope}/`,
			extensions: [
				".ts",
				".tsx",
				".js",
				".jsx",
				".cjs",
				".mjs",
				".json",
				".css",
				".md",
			],
		},

		// 2. CSS cascade layers
		{
			name: "css-layers",
			find: /uiid\.(tokens|globals|components|utilities)/g,
			replace: `${args.prefix}.$1`,
			extensions: [".css", ".ts", ".tsx", ".js", ".cjs", ".mjs"],
		},

		// 3. Token extension key
		{
			name: "token-extension",
			find: "org.uiid.derive",
			replace: `org.${args.prefix}.derive`,
			extensions: [".json", ".ts", ".js", ".cjs", ".mjs"],
		},

		// 4a. GitHub identity — full repo path (most specific, before standalone org)
		{
			name: "github-repo",
			find: "uiid-systems/design-system",
			replace: `${args.org}/${args.repo}`,
			extensions: [".json", ".md"],
		},

		// 4b. GitHub org — standalone occurrences
		{
			name: "github-org",
			find: /\buiid-systems\b/g,
			replace: args.org,
			extensions: [".json", ".md"],
		},

		// 5. App metadata — title strings like "uiid blocks"
		{
			name: "app-metadata",
			find: /"uiid /g,
			replace: `"${args.scope} `,
			extensions: [".ts", ".tsx", ".js", ".json"],
		},

		// 6. Config variable names — uiidPackages, uiidAliases
		{
			name: "config-vars",
			find: /\buiid(Packages|Aliases)\b/g,
			replace: `${scopeCamel}$1`,
			extensions: [".ts", ".js"],
		},

		// 7a. Documentation prose — UIID (uppercase)
		{
			name: "docs-uppercase",
			find: /\bUIID\b/g,
			replace: args.scope.toUpperCase(),
			extensions: [".md"],
		},

		// 7b. Documentation prose — uiid (lowercase, last to catch stragglers)
		{
			name: "docs-lowercase",
			find: /\buiid\b/g,
			replace: args.scope,
			extensions: [".md"],
		},
	];
}

// ── Replacement engine ───────────────────────────────────────────────

function applyRules(
	content: string,
	filePath: string,
	rules: Rule[],
	stats: Stats,
): string | null {
	const ext = path.extname(filePath);
	let result = content;
	let changed = false;

	for (const rule of rules) {
		if (!rule.extensions.includes(ext)) continue;

		if (typeof rule.find === "string") {
			// String find — split/join for global replacement
			const parts = result.split(rule.find);
			if (parts.length > 1) {
				const count = parts.length - 1;
				result = parts.join(rule.replace);
				stats.replacements += count;
				stats.ruleHits[rule.name] = (stats.ruleHits[rule.name] ?? 0) + count;
				changed = true;
			}
		} else {
			// Regex find — ensure global flag
			const flags = rule.find.flags.includes("g")
				? rule.find.flags
				: `${rule.find.flags}g`;
			const regex = new RegExp(rule.find.source, flags);
			const matches = result.match(regex);
			if (matches) {
				result = result.replace(regex, rule.replace);
				stats.replacements += matches.length;
				stats.ruleHits[rule.name] =
					(stats.ruleHits[rule.name] ?? 0) + matches.length;
				changed = true;
			}
		}
	}

	return changed ? result : null;
}

// ── Reset operations ─────────────────────────────────────────────────

function resetVersions(args: Args): void {
	console.log(c.bold("Phase 2: Resetting versions\n"));

	const packageJsonPaths = [path.join(ROOT, "package.json")];

	// Collect package.json from packages/
	const packagesDir = path.join(ROOT, "packages");
	if (fs.existsSync(packagesDir)) {
		for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			const p = path.join(packagesDir, entry.name, "package.json");
			if (fs.existsSync(p)) packageJsonPaths.push(p);
		}
	}

	let count = 0;
	for (const pkgPath of packageJsonPaths) {
		const raw = fs.readFileSync(pkgPath, "utf-8");
		const pkg = JSON.parse(raw);
		if (pkg.version === args.version) continue;

		pkg.version = args.version;
		count++;

		if (!args.dryRun) {
			fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
		}
		console.log(`  ${path.relative(ROOT, pkgPath)} → ${c.cyan(args.version)}`);
	}

	if (count === 0) console.log(c.dim("  All versions already match"));
	console.log("");
}

function cleanChangelogs(args: Args): void {
	console.log(c.bold("Phase 3: Cleaning changelogs\n"));

	let count = 0;

	// Delete pending changeset files
	const changesetDir = path.join(ROOT, ".changeset");
	if (fs.existsSync(changesetDir)) {
		for (const entry of fs.readdirSync(changesetDir)) {
			if (entry === "config.json" || entry === "README.md") continue;
			const filePath = path.join(changesetDir, entry);
			if (!fs.statSync(filePath).isFile()) continue;
			console.log(`  ${c.red("D")} .changeset/${entry}`);
			if (!args.dryRun) fs.unlinkSync(filePath);
			count++;
		}
	}

	// Clear CHANGELOG.md in packages
	const packagesDir = path.join(ROOT, "packages");
	if (fs.existsSync(packagesDir)) {
		for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			const changelog = path.join(packagesDir, entry.name, "CHANGELOG.md");
			if (!fs.existsSync(changelog)) continue;
			console.log(`  ${c.red("R")} packages/${entry.name}/CHANGELOG.md`);
			if (!args.dryRun) fs.writeFileSync(changelog, "# Changelog\n");
			count++;
		}
	}

	// Clear root CHANGELOG.md
	const rootChangelog = path.join(ROOT, "CHANGELOG.md");
	if (fs.existsSync(rootChangelog)) {
		console.log(`  ${c.red("R")} CHANGELOG.md`);
		if (!args.dryRun) fs.writeFileSync(rootChangelog, "# Changelog\n");
		count++;
	}

	if (count === 0) console.log(c.dim("  Nothing to clean"));
	console.log("");
}

async function runInstall(args: Args): Promise<void> {
	console.log(c.bold("Phase 4: Regenerating lock file\n"));

	if (args.dryRun) {
		console.log(c.dim("  Would run: pnpm install\n"));
		return;
	}

	console.log("  Running pnpm install...\n");
	const { execSync } = await import("node:child_process");

	try {
		execSync("pnpm install", { cwd: ROOT, stdio: "inherit" });
		console.log(c.green("\n  Lock file regenerated\n"));
	} catch {
		console.error(c.red("\n  pnpm install failed — run manually after fixing\n"));
	}
}

async function resetGit(args: Args): Promise<void> {
	console.log(c.bold("Phase 5: Resetting git history\n"));

	if (args.dryRun) {
		console.log(c.dim("  Would squash history to single initial commit\n"));
		return;
	}

	const { execSync } = await import("node:child_process");
	const exec = (cmd: string) =>
		execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString().trim();

	try {
		exec("git checkout --orphan fresh");
		exec("git add -A");
		exec('git commit -m "initial commit"');
		exec("git branch -M fresh main");
		console.log(c.green("  History reset to single initial commit"));
		console.log(c.dim("  Push with: git push --force-with-lease\n"));
	} catch (err) {
		console.error(c.red(`  Git reset failed: ${err}\n`));
		process.exit(1);
	}
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
	const args = parseArgs();

	// Header
	console.log("");
	console.log(c.bold("Rebrand Configuration"));
	console.log("\u2500".repeat(40));
	console.log(`  Scope:        ${c.cyan(`@${args.scope}`)}`);
	console.log(`  Prefix:       ${c.cyan(args.prefix)}`);
	console.log(`  GitHub:       ${c.cyan(`${args.org}/${args.repo}`)}`);
	console.log(`  Version:      ${c.cyan(args.version)}`);
	console.log(`  Dry run:      ${args.dryRun ? c.yellow("yes") : "no"}`);
	console.log(`  Skip git:     ${args.skipGit ? c.yellow("yes") : "no"}`);
	console.log(`  Skip install: ${args.skipInstall ? c.yellow("yes") : "no"}`);
	console.log("");

	if (args.dryRun) {
		console.log(c.yellow("DRY RUN \u2014 no files will be modified\n"));
	}

	// Verify repo root
	if (!fs.existsSync(path.join(ROOT, "turbo.json"))) {
		console.error(c.red("Error: must be run from the repository root"));
		process.exit(1);
	}

	// Check for uncommitted changes (warning only)
	if (!args.dryRun) {
		try {
			const { execSync } = await import("node:child_process");
			const status = execSync("git status --porcelain", {
				cwd: ROOT,
				stdio: "pipe",
			})
				.toString()
				.trim();
			if (status) {
				console.log(
					c.yellow(
						"Warning: you have uncommitted changes. Consider committing first.\n",
					),
				);
			}
		} catch {
			// Not a git repo or git not available — continue anyway
		}
	}

	const stats: Stats = {
		filesScanned: 0,
		filesModified: 0,
		replacements: 0,
		ruleHits: {},
	};

	// Phase 1: Find-and-replace
	console.log(c.bold("Phase 1: Renaming references\n"));

	const files = discoverFiles(ROOT);
	const rules = buildRules(args);

	for (const filePath of files) {
		stats.filesScanned++;
		const content = fs.readFileSync(filePath, "utf-8");
		const result = applyRules(content, filePath, rules, stats);

		if (result !== null) {
			stats.filesModified++;
			if (!args.dryRun) {
				fs.writeFileSync(filePath, result);
			}
			console.log(`  ${c.green("M")} ${path.relative(ROOT, filePath)}`);
		}
	}

	console.log(
		`\n  Scanned ${stats.filesScanned} files, modified ${c.green(String(stats.filesModified))}`,
	);
	console.log("");

	// Rule breakdown
	console.log("  Replacements by rule:");
	for (const rule of rules) {
		const hits = stats.ruleHits[rule.name] ?? 0;
		if (hits > 0) {
			console.log(`    ${c.dim(rule.name)}: ${c.cyan(String(hits))}`);
		}
	}
	console.log("");

	// Phase 2-5
	resetVersions(args);
	cleanChangelogs(args);
	if (!args.skipInstall) await runInstall(args);
	if (!args.skipGit) await resetGit(args);

	// Summary
	console.log(c.bold("Done"));
	console.log("\u2500".repeat(40));
	console.log(`  ${c.green(String(stats.filesModified))} files modified`);
	console.log(`  ${c.green(String(stats.replacements))} replacements made`);

	if (args.dryRun) {
		console.log(
			c.yellow(
				"\n  This was a dry run. Re-run without --dry-run to apply changes.\n",
			),
		);
	} else {
		console.log("");
	}
}

main();
