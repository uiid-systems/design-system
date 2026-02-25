#!/bin/bash
set -euo pipefail

echo '{"async": true, "asyncTimeout": 300000}'

# SessionStart hook for Claude Code web agent runtime
# Installs dependencies and sets up Linear API environment variables for agents

# Only run in remote Claude Code web environment
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install dependencies for the remote session
echo "Installing dependencies..." >&2
pnpm install

# Load from local .env.local file if it exists (not committed to git)
if [ -f "${CLAUDE_PROJECT_DIR}/.env.local" ]; then
  # Source the .env.local file to get user's secrets
  set +u  # Allow unset variables temporarily
  source "${CLAUDE_PROJECT_DIR}/.env.local" || true
  set -u
fi

# Export required Linear API variables to the session
{
  [ -n "${LINEAR_API_KEY:-}" ] && echo "export LINEAR_API_KEY='${LINEAR_API_KEY}'"
  [ -n "${LINEAR_TEAM_ID:-}" ] && echo "export LINEAR_TEAM_ID='${LINEAR_TEAM_ID}'"
  [ -n "${LINEAR_WORKSPACE_ID:-}" ] && echo "export LINEAR_WORKSPACE_ID='${LINEAR_WORKSPACE_ID}'"
  [ -n "${LINEAR_ISSUE_ID:-}" ] && echo "export LINEAR_ISSUE_ID='${LINEAR_ISSUE_ID}'"
} >> "${CLAUDE_ENV_FILE}"

exit 0
