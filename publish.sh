#!/bin/bash

ask_proceed()
{
    read -p "Proceed $1 [Y/n/p]? " YN
    if [ "${YN,,}" = "n" ]; then
        exit 0
    fi
}

ask_proceed "Documentation"
if [ "${YN,,}" != "p" ]; then
    npm run jsdoc
fi

ask_proceed "Compile to CommonJS"
if [ "${YN,,}" != "p" ]; then
    npm run compile
fi

ask_proceed "Test"
if [ "${YN,,}" != "p" ]; then
    npm run test
fi

ask_proceed "Commit"
if [ "${YN,,}" != "p" ]; then
    git add docs/
    git add -u
    git add -i
    git commit
fi

ask_proceed "Publish"
if [ "${YN,,}" != "p" ]; then
    yarn publish
fi

ask_proceed "Push"
if [ "${YN,,}" != "p" ]; then
    git push --all
    git push --tags
fi