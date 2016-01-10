#!/bin/bash

node scripts/patch-react-native-babelrc.js
node scripts/patch-ksana-database.js

rm -f "$PWD/node_modules/react-redux/.babelrc"
rm -f "$PWD/node_modules/react-pure-render/.babelrc"
