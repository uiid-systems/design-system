/**
 * Shared config loader for uiid.config.json.
 * Used by rebrand.ts and onboard.ts.
 */

import * as fs from "node:fs";
import * as path from "node:path";

export type DsConfig = { name?: string; org?: string; repo?: string };

const ROOT = path.resolve(import.meta.dirname, "..");

export function loadConfig(): DsConfig {
	const configPath = path.join(ROOT, "uiid.config.json");
	try {
		return JSON.parse(fs.readFileSync(configPath, "utf-8"));
	} catch {
		return {};
	}
}

export function saveConfig(config: DsConfig): void {
	const configPath = path.join(ROOT, "uiid.config.json");
	fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}
