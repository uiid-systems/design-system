const {
  getInfo,
  getInfoFromPullRequest,
} = require("@changesets/get-github-info");

const changelogFunctions = {
  getDependencyReleaseLine: async () => {
    // Return empty string to suppress dependency information since packages are fixed together
    return "";
  },
  getReleaseLine: async (changeset, type, changelogOpts) => {
    if (!changelogOpts || !changelogOpts.repo) {
      // Fallback to simple format if no GitHub info available
      const [firstLine] = changeset.summary.split("\n");
      return `- ${firstLine.trim()}`;
    }

    try {
      let prFromSummary;
      let commitFromSummary;
      let usersFromSummary = [];

      const replacedChangelog = changeset.summary
        .replace(/^\s*(?:pr|pull request):\s*#?(\d+)/im, (_, pr) => {
          let num = Number(pr);
          if (!isNaN(num)) prFromSummary = num;
          return "";
        })
        .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
          commitFromSummary = commit;
          return "";
        })
        .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
          usersFromSummary.push(user);
          return "";
        })
        .trim();

      const [firstLine, ...futureLines] = replacedChangelog
        .split("\n")
        .map((l) => l.trimRight());

      if (prFromSummary !== undefined) {
        let { links, user, pull } = await getInfoFromPullRequest({
          repo: changelogOpts.repo,
          pr: prFromSummary,
        });
        if (user) usersFromSummary.push(user);

        // Clean format: just the PR link and the first line of description
        return `- [PR #${prFromSummary}](${links.pull}): ${firstLine}${futureLines.length > 0 ? `\n${futureLines.map((l) => `  ${l}`).join("\n")}` : ""}`;
      } else if (commitFromSummary) {
        let { links, user } = await getInfo({
          repo: changelogOpts.repo,
          commit: commitFromSummary,
        });
        if (user) usersFromSummary.push(user);

        return `- [${commitFromSummary.slice(0, 7)}](${links.commit}): ${firstLine}${futureLines.length > 0 ? `\n${futureLines.map((l) => `  ${l}`).join("\n")}` : ""}`;
      } else {
        // No PR or commit info, just return the clean summary
        return `- ${firstLine}${futureLines.length > 0 ? `\n${futureLines.map((l) => `  ${l}`).join("\n")}` : ""}`;
      }
    } catch (e) {
      // Fallback to simple format if GitHub API fails
      const [firstLine] = changeset.summary.split("\n");
      return `- ${firstLine.trim()}`;
    }
  },
};

module.exports = changelogFunctions;
