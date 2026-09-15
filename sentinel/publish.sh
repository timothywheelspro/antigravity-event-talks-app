#!/bin/bash
# publish.sh - Full Sovereign publish loop:
#   pre-push gate (Edge Drop) -> git push -> wait for GitHub Pages build -> Canary against the LIVE URL.
# Exit 0 only when the live site returned 200. No log credit otherwise.
set -u
cd "$(dirname "$0")/.." || exit 1

LIVE_URL="https://timothywheelspro.github.io/antigravity-event-talks-app/"
REPO_SLUG="timothywheelspro/antigravity-event-talks-app"

git push "$@" || { echo "[publish] push refused or failed."; exit 1; }

echo "[publish] Waiting for GitHub Pages build..."
head_sha=$(git rev-parse HEAD)
for _ in $(seq 1 24); do   # up to ~2 minutes
    read -r status commit < <(gh api "/repos/$REPO_SLUG/pages/builds/latest" --jq '.status + " " + .commit' 2>/dev/null)
    if [ "$status" = "built" ] && [ "$commit" = "$head_sha" ]; then
        echo "[publish] Pages built at $head_sha."
        exec sentinel/canary-deploy.sh "$LIVE_URL"
    fi
    if [ "$status" = "errored" ]; then
        echo "[publish] Pages build ERRORED."; exit 1
    fi
    sleep 5
done
echo "[publish] Timed out waiting for Pages build. No log written."
exit 1
