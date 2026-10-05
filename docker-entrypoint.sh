#!/bin/sh
set -e

npx prisma db push --skip-generate
node prisma/seed.ts

exec npm run start
