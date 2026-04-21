# Tilla Seaport Challenge

Tilla Seaport Challenge is a full-stack seaport ingestion and dashboard application that imports Excel data into PostgreSQL and exposes it through a NestJS GraphQL API and a React UI.

## What This Project Does

This project watches for seaport Excel files, cleans and validates each record, stores the result in PostgreSQL with Prisma, and displays the imported seaports in a simple dashboard.

## Architecture Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Frontend layer | `frontend/src` | React + Vite UI that fetches seaport data from GraphQL and renders the dashboard table with pagination. |
| API layer | `backend/src/seaports` | NestJS GraphQL resolver and service that expose seaports from the database to the frontend. |
| Job orchestration layer | `backend/src/jobs/seaport-import.scheduler.ts` | Scheduled process that checks for pending Excel files every minute and triggers the import pipeline. |
| Import pipeline layer | `backend/src/jobs` | Reads Excel files, cleans unwanted characters, validates required fields, and prepares records for persistence. |
| Data access layer | `backend/src/prisma` | Shared Prisma service used by NestJS modules to read and write seaport records. |
| Persistence layer | `backend/prisma/schema.prisma` + PostgreSQL | Stores normalized `Seaport` records in Postgres and manages schema changes through Prisma migrations. |
| File processing layer | `backend/data/incoming` and `backend/data/processed` | Incoming Excel files are picked up from `incoming` and moved to `processed` after import. |

## Main Flow

1. Add a `.xlsx` or `.xls` file to `backend/data/incoming`.
2. The scheduler runs every minute and starts the seaport import job.
3. The extractor reads the first worksheet from the Excel file.
4. The cleaner normalizes string and number fields.
5. The validator rejects incomplete or invalid records.
6. Valid rows are upserted into PostgreSQL using Prisma.
7. The processed file is renamed with a timestamp and moved to `backend/data/processed`.
8. The frontend reads the stored data from the GraphQL API and shows it in the dashboard.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: NestJS, GraphQL, Apollo
- Database: PostgreSQL
- ORM and migrations: Prisma
- Scheduling: `@nestjs/schedule`
- File parsing: `xlsx`

## Project Structure

```text
.
|-- backend
|   |-- data
|   |   |-- incoming
|   |   `-- processed
|   |-- prisma
|   |   `-- schema.prisma
|   |-- src
|   |   |-- jobs
|   |   |-- prisma
|   |   `-- seaports
|   `-- test
|-- frontend
|   `-- src
|       |-- api
|       |-- components
|       `-- pages
|-- docker-compose.yaml
`-- bootstrap.sh
```

## Prerequisites

- Node.js 20+ recommended
- npm
- Docker Desktop or Docker Engine with Compose support

## Database Setup With PostgreSQL and Prisma

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d
```

This starts a local PostgreSQL 15 container with:

- host: `localhost`
- port: `5432`
- database: `tilla_seaport`
- username: `postgres`
- password: `postgres`

### 2. Configure backend environment

Create `backend/.env` from `backend/.env.template`.

Expected values:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/tilla_seaport?schema=public"
PORT=3000
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

This applies the schema in `backend/prisma/schema.prisma` and creates the `Seaport` table in PostgreSQL.

### 6. Optional Prisma tools

Open Prisma Studio:

```bash
npx prisma studio
```

## Local Development

### Option 1: One-command startup

Create `backend/.env` from `backend/.env.template`.

Expected values:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/tilla_seaport?schema=public"
PORT=3000
```

From the repository root:

```bash
./bootstrap.sh
```

The script will:

1. Start PostgreSQL with Docker Compose
2. Install backend dependencies
3. Generate Prisma client
4. Run Prisma migration
5. Start the backend in watch mode
6. Install frontend dependencies
7. Start the frontend dev server

### Option 2: Start services manually

Start the backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

## Running the Application

- Frontend: `http://localhost:5173`
- GraphQL API: `http://localhost:3000/graphql`
- PostgreSQL: `localhost:5432`

The backend enables GraphQL Playground, so you can test queries directly in the browser.

## Importing Seaport Files

### Scheduled import

Place Excel files in:

```text
backend/data/incoming
```

The scheduler checks this folder every minute.

After a file is processed:

- valid rows are inserted or updated in the database
- invalid rows are counted in the job result
- the file is moved to `backend/data/processed`

### Manual import

If you want to trigger import without waiting for the scheduler:

```bash
cd backend
npm run load:seaports
```

## GraphQL Query Example

```graphql
query {
  findAllSeaports {
    id
    portName
    locode
    latitude
    longitude
    timezoneOlson
    countryIso
    source
  }
}
```

## Testing

Backend tests:

```bash
cd backend
npm test
```

Frontend tests:

```bash
cd frontend
npm test
```

## Notes

- The frontend currently calls the backend at `http://localhost:3000/graphql`.
- The import pipeline expects Excel column names such as `Port Name`, `Port Locode`, `Latitude`, `Longitude`, `Timezone Olson`, `Country ISO`, and `Source`.
- Prisma uses `locode` as the unique key for upsert operations.

## What can be improved in production:

- Currently scheduler is scheduled for 1 minute, which can be configured
- Minimal test are added, test can be maximized before shipping to production. 
- Currently, job reads data/file from local. Can be updated to read as Azure blob
- Logging can be improvised using Logger for debugging purpose. 

## Scale with larger data:
- Current code supports larger data, since pagination is applied. 
- This can be improved by applying the pagination at the query level. Instead of loading all the data and then paginating at frontend will be become performance heavy. Adding pagination at db level is recommended. 

## To work well in remote team:
- Collabration within team members, transperancy on what we are working. 
- I am currently working remote with US team members and important thing the team focuses is on collabration. I will be up to date with the information from product that help deploy requirements on time. 
