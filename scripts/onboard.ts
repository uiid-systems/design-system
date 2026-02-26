#!/usr/bin/env npx tsx
/**
 * onboard.ts
 *
 * Interactive setup agent for new forks of the design system.
 * Guides the user through naming and configuration, then invokes
 * the rebrand script with the collected inputs.
 *
 * See docs/architecture/rebrand-script.md for full documentation.
 *
 * Usage:
 *   npx tsx scripts/onboard.ts
 */

import * as readline from "node:readline/promises";
import { execSync } from "node:child_process";
import * as path from "node:path";
import { saveConfig } from "./config.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const REBRAND_SCRIPT = path.join(ROOT, "scripts/rebrand.ts");

// ── ANSI helpers ─────────────────────────────────────────────────────

const c = {
	green: (s: string) => `\x1b[32m${s}\x1b[0m`,
	red: (s: string) => `\x1b[31m${s}\x1b[0m`,
	yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
	cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
	dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
	bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

// ── Validation ───────────────────────────────────────────────────────

function validateScope(input: string): string | null {
	const value = input.trim().toLowerCase();
	if (!value) return "Name cannot be empty";
	if (value.length < 2) return "Name must be at least 2 characters";
	if (value.length > 20) return "Name must be 20 characters or fewer";
	if (!/^[a-z]/.test(value)) return "Name must start with a letter";
	if (!/^[a-z][a-z0-9-]*$/.test(value))
		return "Name can only contain lowercase letters, numbers, and hyphens";
	if (value === "uiid") return 'That\'s the current name — pick something new';
	return null;
}

function validateOrg(input: string): string | null {
	const value = input.trim().toLowerCase();
	if (!value) return "Org cannot be empty";
	if (!/^[a-z0-9][a-z0-9-]*$/.test(value))
		return "Org can only contain lowercase letters, numbers, and hyphens";
	return null;
}

function validateRepo(input: string): string | null {
	const value = input.trim().toLowerCase();
	if (!value) return "Repo name cannot be empty";
	if (!/^[a-z0-9][a-z0-9-]*$/.test(value))
		return "Repo name can only contain lowercase letters, numbers, and hyphens";
	return null;
}

// ── Prompt helpers ───────────────────────────────────────────────────

async function ask(
	rl: readline.Interface,
	question: string,
	defaultValue?: string,
): Promise<string> {
	const suffix = defaultValue ? ` ${c.dim(`(${defaultValue})`)}` : "";
	const answer = await rl.question(`${question}${suffix} `);
	return answer.trim() || defaultValue || "";
}

async function askValidated(
	rl: readline.Interface,
	question: string,
	validate: (input: string) => string | null,
	defaultValue?: string,
): Promise<string> {
	while (true) {
		const answer = await ask(rl, question, defaultValue);
		const error = validate(answer);
		if (!error) return answer.trim().toLowerCase();
		console.log(`  ${c.red(error)}\n`);
	}
}

async function confirm(
	rl: readline.Interface,
	question: string,
): Promise<boolean> {
	const answer = await ask(rl, `${question} ${c.dim("[y/n]")}`);
	return answer.toLowerCase().startsWith("y");
}

// ── Steps ────────────────────────────────────────────────────────────

async function stepName(rl: readline.Interface): Promise<string> {
	console.log(c.bold("\n  Step 1: Name your design system\n"));
	console.log(
		"  This name becomes your npm scope, CSS layer prefix, and appears",
	);
	console.log("  throughout the codebase. For example, if you pick \"acme\":\n");
	console.log(`    Packages:   ${c.cyan("@acme/buttons")}, ${c.cyan("@acme/layout")}, ...`);
	console.log(`    CSS layers: ${c.cyan("acme.tokens.component.button")}`);
	console.log(`    Imports:    ${c.cyan('import { Button } from "@acme/buttons"')}`);
	console.log("");
	console.log(
		c.dim(
			"  Tip: Pick something unique and short — a coined word or abbreviation.",
		),
	);
	console.log(
		c.dim(
			'  Names like "uiid" or "zzyzx" are easy to search for. Common words',
		),
	);
	console.log(
		c.dim('  like "core" or "spark" will collide with other code.\n'),
	);

	return askValidated(rl, "  Name:", validateScope);
}

async function stepGitHub(
	rl: readline.Interface,
	scope: string,
): Promise<{ org: string; repo: string }> {
	const defaultOrg = `${scope}-systems`;
	const defaultRepo = "design-system";

	console.log(c.bold("\n  Step 2: GitHub identity\n"));
	console.log("  Package URLs, issue links, and homepage fields will point to");
	console.log("  this GitHub repository.\n");

	const org = await askValidated(rl, "  GitHub org:", validateOrg, defaultOrg);
	const repo = await askValidated(
		rl,
		"  GitHub repo:",
		validateRepo,
		defaultRepo,
	);

	return { org, repo };
}

async function stepConfirm(
	rl: readline.Interface,
	config: { scope: string; org: string; repo: string },
): Promise<"proceed" | "dry-run" | "cancel"> {
	console.log(c.bold("\n  Step 3: Review\n"));
	console.log("  \u2500".repeat(39));
	console.log(`    Scope:       ${c.cyan(`@${config.scope}`)}`);
	console.log(`    Prefix:      ${c.cyan(config.scope)}`);
	console.log(`    GitHub:      ${c.cyan(`${config.org}/${config.repo}`)}`);
	console.log(`    Version:     ${c.cyan("0.0.1")}`);
	console.log("  \u2500".repeat(39));
	console.log("");
	console.log("  This will:");
	console.log("    - Rename ~700 files across the codebase");
	console.log("    - Reset all package versions to 0.0.1");
	console.log("    - Clear changelogs and pending changesets");
	console.log("    - Regenerate the lock file");
	console.log("    - Squash git history to a single initial commit");
	console.log("");

	while (true) {
		const answer = await ask(
			rl,
			`  Proceed? ${c.dim("[yes / dry-run / no]")}`,
		);
		const lower = answer.toLowerCase();

		if (lower === "yes" || lower === "y") return "proceed";
		if (lower === "dry-run" || lower === "dry" || lower === "d")
			return "dry-run";
		if (lower === "no" || lower === "n" || lower === "cancel" || lower === "q")
			return "cancel";

		console.log(c.dim('  Type "yes", "dry-run", or "no"\n'));
	}
}

// ── Execution ────────────────────────────────────────────────────────

function runRebrand(config: {
	scope: string;
	org: string;
	repo: string;
	dryRun: boolean;
}): void {
	const args = [
		"--scope",
		config.scope,
		"--org",
		config.org,
		"--repo",
		config.repo,
	];

	if (config.dryRun) args.push("--dry-run");

	const cmd = `npx tsx "${REBRAND_SCRIPT}" ${args.join(" ")}`;

	try {
		execSync(cmd, { cwd: ROOT, stdio: "inherit" });
	} catch {
		console.error(c.red("\nRebrand script failed. See output above.\n"));
		process.exit(1);
	}
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log("");
	console.log(c.bold("  Welcome to the design system setup"));
	console.log(
		c.dim("  This will rename and reset the project for your team.\n"),
	);

	try {
		// Step 1: Name
		const scope = await stepName(rl);

		// Step 2: GitHub
		const { org, repo } = await stepGitHub(rl, scope);

		// Step 3: Confirm
		const decision = await stepConfirm(rl, { scope, org, repo });

		// Close readline before spawning child process (releases stdin)
		rl.close();

		if (decision === "cancel") {
			console.log(c.dim("\n  Cancelled. No changes made.\n"));
			return;
		}

		// Persist config for future use
		saveConfig({ name: scope, org, repo });

		console.log("");
		runRebrand({ scope, org, repo, dryRun: decision === "dry-run" });

		if (decision === "dry-run") {
			// After dry-run, ask if they want to proceed for real
			const rl2 = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			const proceed = await confirm(rl2, "\n  Apply these changes for real?");
			rl2.close();

			if (proceed) {
				console.log("");
				runRebrand({ scope, org, repo, dryRun: false });
			} else {
				console.log(c.dim("\n  Cancelled. No changes made.\n"));
			}
		}
	} catch (err) {
		rl.close();
		// Handle Ctrl+C gracefully
		if ((err as NodeJS.ErrnoException).code === "ERR_USE_AFTER_CLOSE") {
			console.log(c.dim("\n\n  Cancelled.\n"));
			return;
		}
		throw err;
	}
}

main();
