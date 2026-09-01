#!/usr/bin/env bash
# Vercel Ignored Build Step for the Storybook project.
#
# The contract is exit 0 to skip the build, exit 1 to run it. Any other code
# fails the deployment outright — that is what broke every deploy after #368,
# so this script must never exit with anything else.
#
# Vercel runs it from the project Root Directory (apps/storybook); the
# workspace root is two levels up.
set -u
cd ../.. || exit 1

# Vercel clones shallow, so `origin/main` is not a ref that exists in the build
# container. Fetch it so the query has a base to diff against. A failure here
# is not fatal: the query below will error and fall through to "build".
git fetch --no-tags --depth=100 \
  origin +refs/heads/main:refs/remotes/origin/main >/dev/null 2>&1

# Empty on a branch's first deployment, so the fallback is the common path,
# not an edge case.
base="${VERCEL_GIT_PREVIOUS_SHA:-origin/main}"

# turbo exits 0 for "nothing affected", 1 for "affected", 2 for a query error.
# Collapse 1 and 2 onto build, so a broken query costs one redundant build
# rather than a failed deployment.
npx --yes turbo query affected \
  --tasks build-storybook \
  --packages @uiid/storybook \
  --base "$base" \
  --exit-code || exit 1
