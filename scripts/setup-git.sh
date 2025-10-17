#!/bin/sh

chmod +x .githooks/commit-msg
git config --local core.hooksPath .githooks
