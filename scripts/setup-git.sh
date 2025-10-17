#!/usr/bin/env sh

set -e

chmod +x .githooks/commit-msg
git config --local core.hooksPath .githooks
