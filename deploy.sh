#!/bin/sh

cd app
npm run build
cd ..

cp -r app/build server/public