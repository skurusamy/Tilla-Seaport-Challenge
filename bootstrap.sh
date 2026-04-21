#!/usr/bin/env bash
set -e

echo "Starting seaport import..."

echo "Starting PostgreSQL using Docker..."
docker compose up -d 

echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "Setting up backend"
cd backend
npm install
npx prisma generate 
npx prisma migrate dev --name init

echo "Starting backend application..."
npm run start:dev &

BACKEND_PID=$!

echo "Setting up frontend"
cd ../frontend
npm install
npm run dev -- --host 0.0.0.0 &


FRONTEND_PID=$!

echo 'Application is running!'
echo "Backend http://localhost:3000/graphql"
echo "Frontend http://localhost:5173"

echo "Scheduler will automatically pick and process them every minute."
wait
