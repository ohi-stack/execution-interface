#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/resolve-github-conflicts.sh [main-branch]
# Default main branch: main

MAIN_BRANCH="${1:-main}"

CONFLICT_FILES=(
  CHANGELOG.md
  package-lock.json
  package.json
  src/controllers/api/v1Controller.js
  src/controllers/healthController.js
  src/middleware/rateLimit.js
  src/routes/api/v1Routes.js
  src/routes/index.js
  src/services/recordStore.js
  test/enforcement.test.js
)

echo "Merging ${MAIN_BRANCH} into current branch..."
git merge "${MAIN_BRANCH}" || true

if ! git diff --name-only --diff-filter=U | grep -q .; then
  echo "No merge conflicts detected."
  exit 0
fi

echo "Applying canonical conflict strategy for QR-V launch branch..."

for file in "${CONFLICT_FILES[@]}"; do
  if git ls-files -u -- "$file" | grep -q .; then
    if [[ "$file" == "package-lock.json" ]]; then
      # Keep lockfile from target branch first, regenerate deterministically below.
      git checkout --theirs -- "$file"
    else
      # Keep launch-candidate implementation on feature branch.
      git checkout --ours -- "$file"
    fi
    git add "$file"
  fi
done

# Resolve any other conflicted files by keeping ours (safe default for this branch)
while IFS= read -r extra; do
  git checkout --ours -- "$extra"
  git add "$extra"
done < <(git diff --name-only --diff-filter=U || true)

echo "Rebuilding lockfile..."
npm install --package-lock-only >/dev/null 2>&1 || true
git add package-lock.json || true

echo "Conflict markers remaining:"
git grep -n "<<<<<<<\|=======\|>>>>>>>" || true

echo "Done. Review diff, run tests, and commit." 
