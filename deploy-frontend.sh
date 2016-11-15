#!/usr/bin/env bash

PROJECT_ROOT="../tolderfonen-frontend"
BRANCH="$1"

cd "$PROJECT_ROOT"
git fetch --all
if [ `git branch --list $BRANCH `]
then
  git pull
  #git checkout "$BRANCH"

  #Deployment tasks
  docker-compose up -d
  docker-compose run -d node bower install --allow-root
  docker-compose run -d node gulp --type=staging
else
  echo "$BRANCH does not exist"
fi
