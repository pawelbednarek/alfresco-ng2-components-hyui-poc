#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Core ======"

echo "====== Prebuilt Themes ====="
npm run webpack -- --config ./libs/config/webpack.style.js --progress --profile --bail
rm ./dist/libs/core/lib/prebuilt-themes/*.js
