#!/usr/bin/env bash

PROJECT_ROOT="../tolderfonen-frontend"
BRANCH="$1"

echo "Deploying $BRANCH..."

cd "$PROJECT_ROOT"
git fetch --all
git checkout "$BRANCH"

#Deployment tasks
docker-compose up -d
docker-compose run -d node bower install --allow-root
docker-compose run -d node gulp --type=staging
