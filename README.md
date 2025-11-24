## Better-Auth + NestJS + Vite

This repository demonstrates how to integrate Better-Auth with a NestJS backend and a Vite frontend. It provides a simple example of user authentication using [Better-Auth](https://better-auth.com).

### Prerequisites

- Docker Desktop

### Setup

1. Clone the repository

```bash
git clone https://github.com/jslno/better-auth-nestjs-vite.git
```

2. Setup environment variables

Navigate to both `backend` and `frontend` directories and copy the `.env.example` file to `.env`. Update the environment variables as needed.

### Starting the Application

1. Start the database

```bash
docker compose up -d
```

2. Start the dev environment

```bash
pnpm dev
```

3. Open your browser and navigate to `http://localhost:5173` to access the frontend application.
