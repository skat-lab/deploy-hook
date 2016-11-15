#!/usr/bin/env bash

PROJECT_ROOT="../ionic-conference-app"
BRANCH="$1"

echo "the $BRANCH is the branch"

cd "$PROJECT_ROOT"
git fetch --all
git checkout --force "$BRANCH"

echo "bye bye"
