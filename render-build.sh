#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npx prisma generate
npm run prisma:deploy
npm run prisma:seed
