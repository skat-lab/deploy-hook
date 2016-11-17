#!/bin/bash

BRANCH="$1"
REPO="$2"
PROJECT_DIRECTORY="$REPO-$BRANCH"

if [ ! -d "$PROJECT_DIRECTORY" ]; then
  # Control will enter here if $PROJECT_DIRECTORY doesn't exist.
  git clone git@github.com:$REPOS.git "$PROJECT_DIRECTORY"
fi

cd "$PROJECT_DIRECTORY"

if [ `git branch -r --list origin/$BRANCH ` ]
then
  git checkout $BRANCH
  echo "Hej hej"

  cp config/nginx.staging.conf config/nginx.conf

  #Deployment tasks
  docker-compose up -d
  docker-compose run -d node bower install --allow-root
  docker-compose run -d node gulp --type=staging
else
  echo "$BRANCH does not exist"
fi
