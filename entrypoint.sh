#!/bin/sh

npx typeorm --dataSource=./dist/database/data-source.js migration:run
#node ./dist/database/seeds/run-seed.js

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
