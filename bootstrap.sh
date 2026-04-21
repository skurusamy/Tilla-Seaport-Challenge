#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_ENV_FILE="$PROJECT_ROOT/backend/.env"
BACKEND_ENV_TEMPLATE="$PROJECT_ROOT/backend/.env.template"

if [ ! -f "$BACKEND_ENV_FILE" ]; then
  echo "Missing backend/.env"
  echo "Create backend/.env before running bootstrap.sh."
  if [ -f "$BACKEND_ENV_TEMPLATE" ]; then
    echo "You can copy backend/.env.template to backend/.env and update the values."
  fi
  exit 1
fi

cd "$PROJECT_ROOT"

echo "Starting seaport import..."

echo "Starting PostgreSQL using Docker..."
docker compose up -d 

echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "Setting up backend"
cd "$PROJECT_ROOT/backend"
npm install
npx prisma generate 
npx prisma migrate dev --name init

echo "Starting backend application..."
npm run start:dev &

BACKEND_PID=$!

echo "Setting up frontend"
cd "$PROJECT_ROOT/frontend"
npm install
npm run dev -- --host 0.0.0.0 &


FRONTEND_PID=$!

echo 'Application is running!'
echo "Backend http://localhost:3000/graphql"
echo "Frontend http://localhost:5173"

echo "Scheduler will automatically pick and process them every minute."
wait
