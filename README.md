# find-a-friend
REST API in Node.js

## Application Features
[x] Pet registration <br>
[x] List all pets available for adoption in a given city <br>
[x] Filter pets by characteristics (age, size, etc.) <br>
[x] View details of a specific pet <br>
[x] Organization (ORG) registration <br>
[x] Organization login <br>

## Business Rules
### The following conditions must be implemented:

[x] City is required to list pets <br>
[x] An organization must have an address and a WhatsApp number <br>
[x] Every registered pet must be linked to an organization <br>
[x] Contact for adoption is made directly with the organization via WhatsApp <br>
[x] All pet characteristic filters, except city, are optional <br>
[x] Organizations must be logged in to access administrative features <br>
[x] Only organizations can manage pet data (create, update, delete) <br>
    [x] create <br>
    [x] update <br>
    [x] delete <br>

## Tasks

[x] Route to register an organization (including address and WhatsApp) <br>
[x] Organization login route <br>
[x] Route to register a pet (associated with an organization) <br>
[x] Route to list pets (city required as parameter) <br>
[x] Optional filters by pet characteristics in the listing <br>
[x] Route to view details of a specific pet <br>
[x] Restrict organization admin access to logged-in users <br>
[x] Apply SOLID principles in the API structure <br>
[x] Create tests to validate features and business rules <br>

---

## How to run the application

### Prerequisites

- Node.js (LTS recommended)
- Docker and Docker Compose (for PostgreSQL)
- npm or yarn

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd find-a-friend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (use `.env.example` as reference if it exists) with:

```env
NODE_ENV=dev
PORT=3333
JWT_SECRET=your-secret-jwt-key-here

# Database connection (adjust if using different user/password)
DATABASE_URL="postgresql://docker:docker@localhost:5433/findafriend"
```

- **JWT_SECRET:** A secret string used to sign tokens (e.g. `openssl rand -base64 32`).
- **DATABASE_URL:** Must match the PostgreSQL user, password and port (Docker Compose exposes port **5433**).

### 3. Start the database

```bash
npm run dev:up
```

This starts the PostgreSQL container on port 5433 (user `docker`, password `docker`, database `findafriend`).

### 4. Run migrations and generate Prisma Client

```bash
npm run migrate:dev
npm run generate
```

(If Prisma is already set to run generate after migrate, the second command can be skipped.)

### 5. Start the API

```bash
npm run start:dev
```

The API runs in development mode (with hot reload) at **http://localhost:3333**.

- **Documentation (Swagger):** http://localhost:3333/docs

### Useful commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start the API in development mode |
| `npm run start` | Start the API in production (after `npm run build`) |
| `npm run build` | Build the project to `build/` |
| `npm run dev:up` | Start PostgreSQL with Docker |
| `npm run dev:down` | Stop and remove containers |
| `npm run migrate:dev` | Run Prisma migrations |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests (database must be running) |
