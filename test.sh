#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing backend dependencies..."
cd "$PROJECT_ROOT/backend"
npm install

echo "Running backend tests..."
npm run test:run

echo "Installing frontend dependencies..."
cd "$PROJECT_ROOT/frontend"
npm install

echo "Running frontend tests..."
npm run test:run

echo "All tests passed!"
