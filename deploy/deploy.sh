#!/usr/bin/env bash
# Atomic deploy: build → upload to a new release dir → switch symlink → keep last 5 releases.
# Usage: SSH=user@host ./deploy/deploy.sh
set -euo pipefail
: "${SSH:?set SSH=user@host}"
ROOT=/var/www/sollisero
REL="$ROOT/releases/$(date +%Y%m%d%H%M%S)"
node build.mjs --check                                   # fails on broken links / CSP violations
rsync -az --delete dist/ "$SSH:$REL/"
ssh "$SSH" "ln -sfn '$REL' '$ROOT/current.tmp' && mv -T '$ROOT/current.tmp' '$ROOT/current' \
  && ls -1dt $ROOT/releases/* | tail -n +6 | xargs -r rm -rf"
echo "Deployed $REL"
# Rollback: ssh \$SSH "ln -sfn <previous release> $ROOT/current"
