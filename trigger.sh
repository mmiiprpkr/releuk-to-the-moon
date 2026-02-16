#!/bin/sh

# Ensure we stop if a command fails
set -e

echo "🚀 Triggering remote build..."

# Option A: Modify file (your current way)
# echo "$(date): triggering build" >> build.log

# Option B: The cleaner way (No file changes)
git add .
git commit -m "redeploy: manual trigger $(date)"

git push origin dev
