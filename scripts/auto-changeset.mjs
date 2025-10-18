#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Function to get commits since last release
function getCommitsSinceLastRelease() {
  try {
    // Get the latest tag
    const latestTag = execSync("git describe --tags --abbrev=0", {
      encoding: "utf8",
      stdio: "pipe",
    }).trim();

    // Get commits since the latest tag
    const commits = execSync(`git log ${latestTag}..HEAD --oneline`, {
      encoding: "utf8",
      stdio: "pipe",
    }).trim();

    return commits ? commits.split("\n").filter((line) => line.trim()) : [];
  } catch (error) {
    // If no tags exist, get all commits
    try {
      const commits = execSync("git log --oneline", {
        encoding: "utf8",
        stdio: "pipe",
      }).trim();

      return commits ? commits.split("\n").filter((line) => line.trim()) : [];
    } catch (err) {
      console.warn("Could not get git commits:", err.message);
      return [];
    }
  }
}

// Function to clean up commit messages
function cleanCommitMessage(message) {
  // Remove the commit hash from the beginning
  const cleaned = message.replace(/^[a-f0-9]+\s+/, "");

  // Remove conventional commit prefixes for cleaner messages
  const withoutPrefix = cleaned.replace(
    /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(\(.+\))?:\s*/,
    "",
  );

  // Capitalize first letter
  return withoutPrefix.charAt(0).toUpperCase() + withoutPrefix.slice(1);
}

// Function to generate changeset content
function generateChangesetContent(commits) {
  const cleanedCommits = commits.map(cleanCommitMessage);

  // Create a summary from the commits
  const summary =
    cleanedCommits.length > 1
      ? `Multiple updates including: ${cleanedCommits.slice(0, 3).join(", ")}${cleanedCommits.length > 3 ? "..." : ""}`
      : cleanedCommits[0] || "Latest updates";

  // Generate detailed changelog
  const changelog =
    cleanedCommits.length > 1
      ? cleanedCommits.map((commit) => `- ${commit}`).join("\n")
      : `- ${cleanedCommits[0] || "Latest updates"}`;

  return `---
  "@uiid/buttons": patch
  "@uiid/cards": patch
  "@uiid/forms": patch
  "@uiid/icons": patch
  "@uiid/indicators": patch
  "@uiid/interactive": patch
  "@uiid/layout": patch
  "@uiid/overlays": patch
  "@uiid/tokens": patch
  "@uiid/typography": patch
  "@uiid/utils": patch
---

${summary}

${changelog}
`;
}

// Main function
function createAutoChangeset() {
  const commits = getCommitsSinceLastRelease();

  if (commits.length === 0) {
    console.log("✅ No new commits found since last release");
    return false;
  }

  console.log(`📝 Found ${commits.length} commits since last release:`);
  commits.forEach((commit) => {
    console.log(`  - ${commit}`);
  });

  const changesetContent = generateChangesetContent(commits);

  // Create changeset file with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `auto-${timestamp}.md`;
  const filepath = path.join(process.cwd(), ".changeset", filename);

  fs.writeFileSync(filepath, changesetContent);

  console.log(`✅ Created changeset: ${filename}`);
  console.log("\nChangeset content:");
  console.log(changesetContent);

  return true;
}

// Run the script
if (require.main === module) {
  const created = createAutoChangeset();
  if (created) {
    console.log("\n🚀 Ready to run: pnpm run version-packages");
  } else {
    console.log("\n💡 No changeset needed - no new commits since last release");
  }
}

module.exports = { createAutoChangeset };
