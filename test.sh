#!/bin/bash

./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/mocha --report lcovonly -- -r should --no-timeouts --exit -R spec --file test/dictionary.js
./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/mocha --report lcovonly -- -r should --no-timeouts --exit -R spec --file test/extension.js
./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/mocha --report lcovonly -- -r should --no-timeouts --exit -R spec --file test/types.js
./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/mocha --report lcovonly -- -r should --no-timeouts --exit -R spec --file test/proc.js