#!/bin/bash

BRANCH="$1"
PROJECT_DIRECTORY="tolderfonen-frontend-$BRANCH"

if [ ! -d "$PROJECT_DIRECTORY" ]; then
  # Control will enter here if $PROJECT_DIRECTORY doesn't exist.
  #git clone https://$GITHUB_TOKEN@github.com/skat/tolderfonen-frontend.git "$PROJECT_DIRECTORY"
  git@github.com:skat/tolderfonen-frontend.git
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
