#!/bin/bash
set -euo pipefail

# SessionStart hook for Linear API agent setup
# This hook sets up environment variables for agents that interact with Linear

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
