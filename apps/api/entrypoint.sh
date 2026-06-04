#!/bin/sh
set -e

echo "Running database migrations..."
node node_modules/prisma/build/index.js db push --schema=prisma/schema.prisma --accept-data-loss

echo "Starting server..."
exec node dist/src/index.js
