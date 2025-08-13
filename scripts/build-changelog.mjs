#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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
    { name: "@uiid/ui", path: "packages/ui/CHANGELOG.md" },
    { name: "@uiid/tokens", path: "packages/tokens/CHANGELOG.md" },
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

// Function to extract PR information from git or description
function extractPRInfo(description) {
  // Try to extract PR number from description patterns
  const prPatterns = [
    /(?:PR|pr|pull request)\s*#(\d+)/i,
    /\(#(\d+)\)/,
    /#(\d+)/,
  ];

  for (const pattern of prPatterns) {
    const match = description.match(pattern);
    if (match) {
      return {
        type: "pr",
        number: match[1],
        url: `https://github.com/uiid-systems/design-system/pull/${match[1]}`,
      };
    }
  }

  // Try to find PR from commit hash
  const commitMatch = description.match(/^([a-f0-9]{7}):\s*(.+)$/);
  if (commitMatch) {
    const hash = commitMatch[1];
    try {
      // Try to find the specific merge commit that contains this hash
      const mergeCommit = execSync(
        `git log --merges --oneline --ancestry-path ${hash}..HEAD | tail -1`,
        {
          encoding: "utf8",
          stdio: "pipe",
        },
      ).trim();

      const prMatch = mergeCommit.match(/Merge pull request #(\d+)/);
      if (prMatch) {
        return {
          type: "pr",
          number: prMatch[1],
          url: `https://github.com/uiid-systems/design-system/pull/${prMatch[1]}`,
        };
      }
    } catch (error) {
      // Silent fail - we'll just return the commit hash
    }

    return {
      type: "commit",
      hash: hash,
      url: `https://github.com/uiid-systems/design-system/commit/${hash}`,
    };
  }

  return null;
}

// Generate Mintlify changelog.mdx content
function generateMintlifyChangelog(changelogData) {
  const frontmatter = `---
title: "Changelog"
description: "Version history and release notes for UIID Design System"
rss: true
---

`;

  // Get all versions across all packages and sort by version (descending)
  const allVersions = [];
  changelogData.forEach((pkg) => {
    pkg.entries.forEach((entry) => {
      const existing = allVersions.find((v) => v.version === entry.version);
      if (!existing) {
        allVersions.push({
          version: entry.version,
          date: entry.date,
          packages: [{ name: pkg.packageName, entry }],
        });
      } else {
        existing.packages.push({ name: pkg.packageName, entry });
      }
    });
  });

  // Sort versions in descending order
  allVersions.sort((a, b) => {
    const aVersion = a.version.split(".").map(Number);
    const bVersion = b.version.split(".").map(Number);

    for (let i = 0; i < Math.max(aVersion.length, bVersion.length); i++) {
      const aPart = aVersion[i] || 0;
      const bPart = bVersion[i] || 0;
      if (aPart !== bPart) {
        return bPart - aPart;
      }
    }
    return 0;
  });

  let content = frontmatter;

  // Generate Update components for each version
  allVersions.forEach((versionData) => {
    const mainPackage =
      versionData.packages.find((p) => p.name === "@uiid/ui") ||
      versionData.packages[0];

    // Filter out dependency updates and format as markdown list
    const relevantChanges = mainPackage.entry.changes
      .filter((c) => !c.description.includes("Updated dependencies"))
      .filter((c) => !c.description.includes("@uiid/tokens@"))
      .filter((c) => !c.description.includes("@uiid/ui@"))
      .filter((c) => !c.description.match(/^Updated dependencies/i))
      .filter((c) => !c.description.match(/- @uiid\/(tokens|ui)@/))
      .filter((c) => !c.description.includes("Updated dependencies ["))
      .filter((c) => !c.description.match(/dependency.*@uiid/i))
      .filter((c) => !c.description.match(/^- Updated dependencies/))
      .filter(
        (c) => !c.description.match(/^\s*@uiid\/(tokens|ui)@\d+\.\d+\.\d+\s*$/),
      )
      .filter((c) => c.description.trim() !== "");

    // Format changes as markdown list with GitHub links for commit hashes
    const mainChanges =
      relevantChanges.length > 0
        ? relevantChanges
            .map((c) => {
              const desc = c.description;
              const prInfo = extractPRInfo(desc);

              if (prInfo) {
                let linkText = "";
                let cleanDesc = desc;

                if (prInfo.type === "pr") {
                  linkText = `[PR #${prInfo.number}](${prInfo.url})`;
                  // Remove PR reference from description to avoid duplication
                  cleanDesc = desc
                    .replace(/(?:PR|pr|pull request)\s*#\d+/i, "")
                    .replace(/\(#\d+\)/, "")
                    .trim();

                  // Also clean any commit hash that might be in the description
                  cleanDesc = cleanDesc.replace(/^[a-f0-9]{7}:\s*/, "").trim();
                } else if (prInfo.type === "commit") {
                  linkText = `[${prInfo.hash}](${prInfo.url})`;
                  // Remove commit hash from description
                  cleanDesc = desc.replace(/^[a-f0-9]{7}:\s*/, "").trim();
                }

                // Clean up the description further - remove redundant commit hash patterns
                cleanDesc = cleanDesc.replace(/^[a-f0-9]{7}:\s*/, "").trim();

                return `- ${linkText}: ${cleanDesc}`;
              }

              // Regular change without any linkable references
              return `- ${desc}`;
            })
            .join("\n")
        : "- Latest updates";

    // Determine tags based on changes
    const allChangesText = relevantChanges.map((c) => c.description).join(" ");
    const tags = ["release"];
    if (allChangesText.toLowerCase().includes("test")) tags.push("testing");
    if (allChangesText.toLowerCase().includes("docs")) tags.push("docs");
    if (allChangesText.toLowerCase().includes("workflow"))
      tags.push("workflow");
    if (allChangesText.toLowerCase().includes("automation"))
      tags.push("automation");

    content += `<Update label="${versionData.date}" description="v${versionData.version}" tags={${JSON.stringify(tags)}}>
**🚀 Release v${versionData.version}**

${mainChanges}

**Updated dependencies:** All packages now at v${versionData.version}

</Update>

`;
  });

  // Add footer
  content += `
---

## Upcoming Features

We're actively working on expanding the design system:

- **🎨 More Tokens** - Typography, spacing, shadows, and animation tokens
- **🧩 New Components** - Card, Input, Select, Modal, and more
- **📖 Enhanced Docs** - Interactive examples and usage guidelines
- **🤖 Automation** - Automated releases and documentation generation
- **🔧 Developer Tools** - CLI tools for component generation

---

## Stay Updated

- **RSS Feed**: Subscribe to our [changelog RSS feed](/changelog/rss.xml)
- **GitHub**: Watch our [repository](https://github.com/uiid-systems/design-system) for updates
- **Storybook**: View the latest components at [localhost:6006](http://localhost:6006)
`;

  return content;
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

// Generate Mintlify changelog.mdx
const mintlifyContent = generateMintlifyChangelog(changelogData);
const mintlifyPath = path.resolve(process.cwd(), "apps/docs/changelog.mdx");
fs.writeFileSync(mintlifyPath, mintlifyContent);
console.log("📝 Generated apps/docs/changelog.mdx");

console.log("✅ Changelog build complete!");
