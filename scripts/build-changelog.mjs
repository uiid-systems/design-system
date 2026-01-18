#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Entries to filter out of the changelog (internal/housekeeping items)
const FILTERED_PATTERNS = [
  /^chore:/i, // All chore entries
  /^chore\(.+\):/i, // chore(scope): entries
  /release workflows?/i, // Workflow-related fixes
  /changelog story/i, // Changelog-related changes
  /^ci:/i, // CI changes
  /^ci\(.+\):/i, // ci(scope): entries
  /^build:/i, // Build system changes (unless significant)
  /^build\(.+\):/i, // build(scope): entries
];

// Check if an entry should be filtered out
function shouldFilter(description) {
  return FILTERED_PATTERNS.some((pattern) => pattern.test(description));
}

// Parse conventional commit type from description
function parseCommitType(description) {
  const match = description.match(
    /^(feat|fix|docs|style|refactor|test|perf|revert)(?:\(.+\))?:/i,
  );
  if (match) {
    const type = match[1].toLowerCase();
    // Map to display categories
    const typeMap = {
      feat: "features",
      fix: "fixes",
      docs: "documentation",
      style: "styles",
      refactor: "refactors",
      test: "tests",
      perf: "performance",
      revert: "reverts",
    };
    return typeMap[type] || "other";
  }
  return "other";
}

// Clean up description for display (remove conventional commit prefix)
function cleanDescription(description) {
  // Remove conventional commit prefix
  const cleaned = description.replace(
    /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(?:\(.+\))?:\s*/i,
    "",
  );
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// Extract PR number from description if present
function extractPrNumber(description) {
  const match = description.match(/\(#(\d+)\)$/);
  return match ? parseInt(match[1], 10) : null;
}

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
        changes: {
          features: [],
          fixes: [],
          refactors: [],
          performance: [],
          documentation: [],
          other: [],
        },
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
      const rawDescription = line.substring(2);

      // Skip dependency-related entries
      if (
        rawDescription.includes("Updated dependencies") ||
        rawDescription.match(/@uiid\/(tokens|ui)@\d+\.\d+\.\d+/) ||
        rawDescription.match(/^Updated dependencies \[/)
      ) {
        continue;
      }

      // Filter out noise (chore, ci, etc.)
      if (shouldFilter(rawDescription)) {
        continue;
      }

      // Parse the change type and clean description
      const category = parseCommitType(rawDescription);
      const cleanedDescription = cleanDescription(rawDescription);
      const prNumber = extractPrNumber(rawDescription);

      // Infer semver type from version number
      const semverType = currentEntry.version.endsWith(".0.0")
        ? "major"
        : currentEntry.version.split(".")[2] === "0"
          ? "minor"
          : "patch";

      const changeEntry = {
        description: cleanedDescription,
        raw: rawDescription,
        semverType,
        ...(prNumber && { pr: prNumber }),
      };

      // Add to appropriate category
      if (currentEntry.changes[category]) {
        currentEntry.changes[category].push(changeEntry);
      } else {
        currentEntry.changes.other.push(changeEntry);
      }
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

// Build a unified changelog that deduplicates entries across packages
function buildUnifiedChangelog(packageChangelogs) {
  const versionMap = new Map();

  // Collect all entries by version
  for (const pkg of packageChangelogs) {
    for (const entry of pkg.entries) {
      if (!versionMap.has(entry.version)) {
        versionMap.set(entry.version, {
          version: entry.version,
          date: entry.date,
          changes: {
            features: new Map(),
            fixes: new Map(),
            refactors: new Map(),
            performance: new Map(),
            documentation: new Map(),
            other: new Map(),
          },
          packages: new Set(),
        });
      }

      const unified = versionMap.get(entry.version);
      unified.packages.add(pkg.packageName);

      // Merge changes, deduplicating by description
      for (const [category, changes] of Object.entries(entry.changes)) {
        for (const change of changes) {
          const key = change.description.toLowerCase();
          if (!unified.changes[category].has(key)) {
            unified.changes[category].set(key, {
              ...change,
              packages: [pkg.packageName],
            });
          } else {
            // Add this package to the existing entry
            unified.changes[category].get(key).packages.push(pkg.packageName);
          }
        }
      }
    }
  }

  // Convert to array and sort by version (descending)
  const unified = Array.from(versionMap.values())
    .map((entry) => ({
      version: entry.version,
      date: entry.date,
      packages: Array.from(entry.packages).sort(),
      changes: {
        features: Array.from(entry.changes.features.values()),
        fixes: Array.from(entry.changes.fixes.values()),
        refactors: Array.from(entry.changes.refactors.values()),
        performance: Array.from(entry.changes.performance.values()),
        documentation: Array.from(entry.changes.documentation.values()),
        other: Array.from(entry.changes.other.values()),
      },
    }))
    .sort((a, b) => {
      const aParts = a.version.split(".").map(Number);
      const bParts = b.version.split(".").map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        if (aPart !== bPart) return bPart - aPart;
      }
      return 0;
    });

  return unified;
}

// Check if a version has any meaningful changes
function hasChanges(entry) {
  return Object.values(entry.changes).some((arr) => arr.length > 0);
}

// Main function to build changelog data
function buildChangelogData() {
  const packages = [
    { name: "@uiid/backgrounds", path: "packages/backgrounds/CHANGELOG.md" },
    { name: "@uiid/blocks", path: "packages/blocks/CHANGELOG.md" },
    { name: "@uiid/buttons", path: "packages/buttons/CHANGELOG.md" },
    { name: "@uiid/calendars", path: "packages/calendars/CHANGELOG.md" },
    { name: "@uiid/cards", path: "packages/cards/CHANGELOG.md" },
    { name: "@uiid/forms", path: "packages/forms/CHANGELOG.md" },
    { name: "@uiid/icons", path: "packages/icons/CHANGELOG.md" },
    { name: "@uiid/indicators", path: "packages/indicators/CHANGELOG.md" },
    { name: "@uiid/interactive", path: "packages/interactive/CHANGELOG.md" },
    { name: "@uiid/layout", path: "packages/layout/CHANGELOG.md" },
    { name: "@uiid/lists", path: "packages/lists/CHANGELOG.md" },
    { name: "@uiid/navigation", path: "packages/navigation/CHANGELOG.md" },
    { name: "@uiid/overlays", path: "packages/overlays/CHANGELOG.md" },
    { name: "@uiid/tables", path: "packages/tables/CHANGELOG.md" },
    { name: "@uiid/tokens", path: "packages/tokens/CHANGELOG.md" },
    { name: "@uiid/typography", path: "packages/typography/CHANGELOG.md" },
    { name: "@uiid/utils", path: "packages/utils/CHANGELOG.md" },
  ];

  const existingDates = loadExistingChangelogData();
  const packageChangelogs = [];

  // Make existing dates available globally for parseChangelog
  global.existingDates = existingDates;

  for (const pkg of packages) {
    try {
      const changelogPath = path.resolve(process.cwd(), pkg.path);
      const content = fs.readFileSync(changelogPath, "utf8");
      const parsed = parseChangelog(content, pkg.name);
      packageChangelogs.push(parsed);

      // Count non-empty categories
      const totalChanges = parsed.entries.reduce((sum, entry) => {
        return (
          sum +
          Object.values(entry.changes).reduce(
            (catSum, arr) => catSum + arr.length,
            0,
          )
        );
      }, 0);

      console.log(
        `✅ Processed ${pkg.name} (${parsed.entries.length} versions, ${totalChanges} changes)`,
      );
    } catch (error) {
      console.warn(`⚠️  Could not read ${pkg.name} changelog:`, error.message);
    }
  }

  return {
    packageChangelogs,
    unified: buildUnifiedChangelog(packageChangelogs),
  };
}

// Main execution
console.log("🔄 Building changelog data...\n");

const { packageChangelogs, unified } = buildChangelogData();

// Filter out versions with no meaningful changes
const filteredUnified = unified.filter(hasChanges);

// Write unified changelog (the main output for display)
const unifiedPath = path.resolve(process.cwd(), "packages/changelog.json");
fs.writeFileSync(unifiedPath, JSON.stringify(filteredUnified, null, 2));
console.log(
  `\n📄 Generated packages/changelog.json (${filteredUnified.length} versions with changes)`,
);

// Write per-package changelogs for reference
const packagesPath = path.resolve(
  process.cwd(),
  "packages/changelog-packages.json",
);
fs.writeFileSync(packagesPath, JSON.stringify(packageChangelogs, null, 2));
console.log(
  `📄 Generated packages/changelog-packages.json (${packageChangelogs.length} packages)`,
);

// Summary
console.log("\n📊 Summary:");
for (const version of filteredUnified) {
  const changeCount = Object.values(version.changes).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  console.log(
    `   v${version.version} (${version.date}): ${changeCount} changes across ${version.packages.length} packages`,
  );
}

console.log("\n✅ Changelog build complete!");
