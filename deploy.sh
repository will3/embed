#!/bin/sh

cd app
npm run build
cd ..

rm -rf server/public
cp -r app/build server/public
rm server/public/static/js/*.map
rm server/public/static/css/*.map

git add .
git commit -m 'DEPLOY'
git push heroku