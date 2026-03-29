#!/usr/bin/env bash
# Validates that all changesets use patch-only bumps.
# Pre-1.0 packages treat minor/major as breaking version jumps.

set -euo pipefail

errors=0

for file in .changeset/*.md; do
  [ "$file" = ".changeset/*.md" ] && break  # no matches
  [ "$(basename "$file")" = "README.md" ] && continue

  # Extract bump types from YAML frontmatter (between --- delimiters)
  bumps=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$file" | grep -oE '(patch|minor|major)' || true)

  for bump in $bumps; do
    if [ "$bump" != "patch" ]; then
      echo "error: $file contains '$bump' bump (only patch allowed pre-1.0)"
      errors=$((errors + 1))
    fi
  done
done

if [ "$errors" -gt 0 ]; then
  echo ""
  echo "All changesets must use 'patch' bumps while packages are pre-1.0."
  echo "Change minor/major to patch in the files above."
  exit 1
fi
