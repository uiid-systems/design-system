#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Function to get version date from git tags or preserve existing
function getVersionDate(version, existingDate = null, isNewVersion = false) {
  try {
    const gitDate = execSync(`git log -1 --format=%ci v${version}`, {
      encoding: "utf8",
      stdio: "pipe",
    }).trim();
    if (gitDate) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(gitDate).toLocaleDateString("en-US", options);
    }
  } catch (error) {
    // If git command fails and we have existing date, preserve it
    if (existingDate) {
      console.log(
        `Preserving existing date for version ${version}: ${existingDate}`,
      );
      return existingDate;
    }

    // Only use current date for truly new versions being created now
    if (isNewVersion) {
      console.log(`Using current date for new version ${version}`);
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // For historical versions without git tags or existing dates, be explicit
    console.warn(
      `Could not determine date for version ${version} - no git tag or existing date found`,
    );
    return "Date unavailable";
  }

  // Fallback should never be reached, but just in case
  return "Date unavailable";
}

// Function to parse a single CHANGELOG.md file
function parseChangelog(content, packageName) {
  const lines = content.split("\n");
  const entries = [];
  let currentEntry = null;
  let currentSection = null;

  // First pass: find the highest version number to identify current version
  const versionMatches = content.match(/^## (\d+\.\d+\.\d+)/gm);
  const versions = versionMatches
    ? versionMatches.map((match) => match.replace("## ", ""))
    : [];
  const highestVersion = versions.sort((a, b) => {
    const aParts = a.split(".").map(Number);
    const bParts = b.split(".").map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart !== bPart) return bPart - aPart;
    }
    return 0;
  })[0];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match version headers (## 1.0.0 or ## 1.0.0 - 2024-01-01)
    const versionMatch = line.match(/^## (\d+\.\d+\.\d+)(?:\s*-\s*(.+))?$/);
    if (versionMatch) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      const existingDateKey = `${packageName}-${versionMatch[1]}`;
      const existingDate = global.existingDates
        ? global.existingDates[existingDateKey]
        : null;
      const isCurrentVersion = versionMatch[1] === highestVersion;

      currentEntry = {
        version: versionMatch[1],
        date:
          versionMatch[2] ||
          getVersionDate(versionMatch[1], existingDate, isCurrentVersion),
        changes: [],
        dependencies: [],
      };
      currentSection = null;
      continue;
    }

    // Match section headers
    if (line.match(/^### (Patch|Minor|Major) Changes$/)) {
      currentSection = "changes";
      continue;
    }

    if (line.match(/^### Updated [Dd]ependencies/)) {
      currentSection = "dependencies";
      continue;
    }

    // Parse changes
    if (currentSection === "changes" && line.startsWith("- ") && currentEntry) {
      const description = line.substring(2);

      // Skip dependency-related entries
      if (
        description.includes("Updated dependencies") ||
        description.match(/@uiid\/(tokens|ui)@\d+\.\d+\.\d+/) ||
        description.match(/^Updated dependencies \[/)
      ) {
        continue;
      }

      // Infer type from version number
      const type = currentEntry.version.endsWith(".0.0")
        ? "major"
        : currentEntry.version.split(".")[2] === "0"
          ? "minor"
          : "patch";

      currentEntry.changes.push({
        type,
        description,
      });
    }

    // Parse dependencies
    if (
      currentSection === "dependencies" &&
      line.includes("@") &&
      currentEntry
    ) {
      const depMatch = line.match(/- (.+)@(.+)/);
      if (depMatch) {
        currentEntry.dependencies.push({
          name: depMatch[1],
          version: depMatch[2],
        });
      }
    }
  }

  // Add the last entry
  if (currentEntry) {
    entries.push(currentEntry);
  }

  return {
    packageName,
    entries,
  };
}

// Load existing changelog data to preserve dates
function loadExistingChangelogData() {
  try {
    const existingPath = path.resolve(process.cwd(), "packages/changelog.json");
    if (fs.existsSync(existingPath)) {
      const existingData = JSON.parse(fs.readFileSync(existingPath, "utf8"));
      const dateMap = {};
      existingData.forEach((pkg) => {
        pkg.entries.forEach((entry) => {
          const key = `${pkg.packageName}-${entry.version}`;
          dateMap[key] = entry.date;
        });
      });
      return dateMap;
    }
  } catch (error) {
    console.warn("Could not load existing changelog data:", error.message);
  }
  return {};
}

// Main function to build changelog data
function buildChangelogData() {
  const packages = [
    { name: "@uiid/buttons", path: "packages/buttons/CHANGELOG.md" },
    { name: "@uiid/cards", path: "packages/cards/CHANGELOG.md" },
    { name: "@uiid/forms", path: "packages/forms/CHANGELOG.md" },
    { name: "@uiid/icons", path: "packages/icons/CHANGELOG.md" },
    { name: "@uiid/indicators", path: "packages/indicators/CHANGELOG.md" },
    { name: "@uiid/interactive", path: "packages/interactive/CHANGELOG.md" },
    { name: "@uiid/layout", path: "packages/layout/CHANGELOG.md" },
    { name: "@uiid/overlays", path: "packages/overlays/CHANGELOG.md" },
    { name: "@uiid/tokens", path: "packages/tokens/CHANGELOG.md" },
    { name: "@uiid/typography", path: "packages/typography/CHANGELOG.md" },
    { name: "@uiid/utils", path: "packages/utils/CHANGELOG.md" },
  ];

  const existingDates = loadExistingChangelogData();
  const changelogData = [];

  // Make existing dates available globally for parseChangelog
  global.existingDates = existingDates;

  for (const pkg of packages) {
    try {
      const changelogPath = path.resolve(process.cwd(), pkg.path);
      const content = fs.readFileSync(changelogPath, "utf8");
      const parsed = parseChangelog(content, pkg.name);
      changelogData.push(parsed);
      console.log(
        `✅ Processed ${pkg.name} (${parsed.entries.length} entries)`,
      );
    } catch (error) {
      console.warn(`⚠️  Could not read ${pkg.name} changelog:`, error.message);
    }
  }

  return changelogData;
}

// Main execution
console.log("🔄 Building changelog data...");

const changelogData = buildChangelogData();

// Write JSON file for programmatic consumption
const jsonPath = path.resolve(process.cwd(), "packages/changelog.json");
fs.writeFileSync(jsonPath, JSON.stringify(changelogData, null, 2));
console.log(
  `📄 Generated packages/changelog.json (${changelogData.length} packages)`,
);

console.log("✅ Changelog build complete!");
