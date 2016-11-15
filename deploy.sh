#!/usr/bin/env bash

PROJECT_ROOT="../ionic-conference-app"
BRANCH="$1"

echo "Deploying $BRANCH..."

cd "$PROJECT_ROOT"
git fetch --all
git checkout --force "$BRANCH"

#Deployment tasks
