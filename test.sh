#!/bin/bash

./node_modules/mocha/bin/mocha -r should --no-timeouts --exit test/dictionary.js
./node_modules/mocha/bin/mocha -r should --no-timeouts --exit test/parser.js
./node_modules/mocha/bin/mocha -r should --no-timeouts --exit test/segmenter.js
./node_modules/mocha/bin/mocha -r should --no-timeouts --exit test/tagger.js