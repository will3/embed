#!/bin/sh

cd app
npm run build
cd ..

rm -rf server/public
cp -r app/build server/public