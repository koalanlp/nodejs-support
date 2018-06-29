#!/bin/bash

npm run jsdoc
npm run compile
npm run test
git add docs/
git add -u
git add -i
git commit
yarn publish
git push --all