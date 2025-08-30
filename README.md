# Todo List API (Express + Prisma + MySQL)
This repository is the **backend (API)** for the Todo List App. 

> 🧩 **This API is one half of the Todo List App.**  
> It’s designed to be used together with the Next.js frontend:
>
> **Frontend repo:** https://github.com/xixi743/TodoListApp-frontend
>
> **Local defaults**
> - API: http://localhost:4000
> - Frontend: http://localhost:3000
>
> Start the API first, then run the frontend.


It exposes a small set of **REST endpoints** that the frontend uses to create, list, update, and delete tasks.
- **Express** is the web server that handles HTTP requests.
- **Prisma** is the database toolkit/ORM that talks to MySQL.
- **MySQL** stores the data. In development we run it in a **Docker** container so no manual database install is required.

## What you get
- **REST API** with routes:
  - `GET /` - a friendly landing that returns "Todo API is running`
  - `GET /tasks` — list all tasks and a simple summary
  - `POST /tasks` — create a new task
  - `PUT /tasks/:id` — update a task (title, color, or completed)
  - `DELETE /tasks/:id` — delete a task
- **TypeScript** for better safety and editor autocomplete
- **Prisma schema & migrations** for a reproducible database
- **CORS** enabled (so the Next.js frontend at `http://localhost:3000` can call the API)
- A **simple health check** at `GET /health` that returns `{ "ok": true }`

REST API route screenshot examples:

- GET `/`

  <img width="263" height="87" alt="image" src="https://github.com/user-attachments/assets/c665e9c8-242a-45aa-9047-904c7b3ffc0c" />
- GET `/health`

  <img width="320" height="99" alt="image" src="https://github.com/user-attachments/assets/ab96480e-0d20-4754-bc53-682369478bc3" />

- GET `/tasks`

  <img width="957" height="273" alt="image" src="https://github.com/user-attachments/assets/2d1c5c2e-181f-47c3-b4ae-c402518c5ca4" />



## Prerequisites

You only need two things installed locally:

1. **Node.js 18+**
  Check with:
    ```
    node -v
    ```
2. **Docker Desktop** (so we can run MySQL in a container)
  Check with:
    ```
    docker --version
    docker compose version
    ```
    If Docker is not running, start Docker Desktop first.

## Project Structure (short tour)
```
TodoListApp-backend/
├─ prisma/
│  ├─ schema.prisma          # Prisma data model (Task)
│  └─ migrations/            # Auto-generated SQL for schema changes
├─ src/
│  ├─ index.ts               # Express app entry point (starts the server)
│  ├─ prisma.ts              # Prisma client instance
│  └─ tasks.router.ts        # /tasks routes (GET/POST/PUT/DELETE)
├─ docker-compose.yml        # MySQL container for local dev
├─ .env.example              # Example environment variables
├─ package.json              # Scripts and dependencies
└─ tsconfig.json             # TypeScript config

```

## Quick start (the short version)
```
# 1) Start MySQL in Docker
docker compose up -d

# 2) Configure environment
cp .env.example .env

# 3) Install deps
npm install

# 4) Generate Prisma Client and create DB tables
npx prisma generate
npx prisma migrate dev --name init

# 5) Run the server (http://localhost:4000)
npm run dev
```

## Step-by-step (the longer, friendlier version)

1. Start the database
  We use Docker to run MySQL locally so you don't have to install anything complicated. 
    ```
    docker compose up -d
    ```
    - This creates a container named `todo_mysql`. 
    - Credentials are set in `docker-compose.yml` and mirrored in `.env.example`:
        - **user**: `root`
        - **password**: `root`
        - **database**: `todo_app`
    - MySQL will be available on port **3306** on your machine. 

    Verify it's running:
    ```
    docker ps
    # Look for a 'mysql:8.0' container and that its STATUS is 'Up'
    ```
2. Copy the environment file
    ```
    cp .env.example .env
    ```
    What's inside the `.env`?
    ```
    DATABASE_URL="mysql://root:root@localhost:3306/todo_app"
    PORT=4000
    CORS_ORIGIN=http://localhost:3000
    ```
    - `DATABASE_URL` tells Prisma how to connect to MySQL.
    - `PORT` is where the API will listen.
    - `CORS_ORIGIN` is the allowed web app origin (your Next.js frontend).
    <br />
3. Install dependencies
    ```
    npm install
    ```
4. Generate Prisma Client & apply migrations
    ```
    npx prisma generate
    npx prisma migrate dev --name init
    ```
    - `generate` compiles Prisma's **type-safe client** for your project.
    - `migrate dev` creates the tables defined in `prisma/schema.prisma`.
    <br />
5. Run the server
    ```
    npm run dev
    ```
    Open `http://localhost:4000/health` -> you should see `{"ok":true}`. 
    > Tip: You can also open a friendly DB UI with
    > `npx prisma studio` -> http://localhost:5555
    > <img width="1495" height="461" alt="image" src="https://github.com/user-attachments/assets/918851aa-37bf-4b7b-8538-8b6da9c380f7" />


  ## API Reference (with examples)
  All endpoints are relative to `http://localhost:4000`.

  **Health Check**
  ```
  GET /health
  ```

  **Response**
  ```
  { "ok": true }
  ```
  
  ---
  #### List Tasks
  ```
  GET /tasks
  ```
  **Success (200)**
  ```
  {
  "tasks": [
    {
      "id": 1,
      "title": "Buy milk",
      "color": "green",
      "completed": false,
      "createdAt": "2025-08-29T05:26:09.215Z",
      "updatedAt": "2025-08-29T05:26:09.215Z"
    }
  ],
  "summary": { "total": 1, "completed": 0 }
    }
  ```
  ---
#### Create a task
```
POST /tasks
Content-Type: application/json
```

**Body**
```
{ "title": "Take dog out", "color": "orange" }
```
**Success (201)**
```
{
  "id": 2,
  "title": "Take dog out",
  "color": "orange",
  "completed": false,
  "createdAt": "2025-08-29T05:30:00.000Z",
  "updatedAt": "2025-08-29T05:30:00.000Z"
}
```
Validation notes
- `title` is **required** (non-empty string).
- `color` is a simple string (e.g., `"red"`, `"blue"`, `"green"`, etc.).
---
#### Update a task
```
PUT /tasks/:id
Content-Type: application/json
```
**Body** (any of these fields are allowed)
```
{ "title": "Water plants", "color": "blue", "completed": true }
```
**Success (200)**
```
{
  "id": 2,
  "title": "Water plants",
  "color": "blue",
  "completed": true,
  "createdAt": "2025-08-29T05:30:00.000Z",
  "updatedAt": "2025-08-29T05:40:12.123Z"
}
```
---
#### Delete a task

```
DELETE /tasks/:id
```
**Success (204)** - no body.

---
### Error Responses (what you might see)
- **400 Bad Request** - missing or invalid body (e.g., no `title`)
- **404 Not Found** - task id does not exist
- **500 Internal Server Error** - unexpected server error
Errors are returned as JSON like:
    ```
    { "error": "Task not found" }
    ```

---

### How CORS is handled
The server allows requests from the frontend origin you set in `.env`:
```
CORS_ORIGIN=http://localhost:3000
```
If your frontend runs elsewhere (e.g., deployed), change this value and restart the server.

---

### Developing & debugging
- **See live DB rows**: `npx prisma studio`
- **Log queries** (optional): set `log` in your Prisma client (in `src/prisma.ts`) if you want verbose SQL logs.
- **Change the schema**:
    1. Edit `prisma/schema.prisma`
    2. `npx prisma migrate dev --name <change-name>
    3. The DB is updated and Prisma Client is generated.

---

### Resetting the database (danger zone)
If you want a clean slate locally:
```
# stop and remove the DB container & volume
docker compose down -v

# bring it back up
docker compose up -d

# re-apply schema (will recreate tables)
npx prisma migrate dev --name init
```
> Alternative: `npx prisma migrate reset` (erases data, re-applies migrations). 

---

### Running without Docker (optional)
If you already have MySQL running locally or in the cloud:
1. Create a database (e.g., `todo_app`).
2. Put its connection string into `.env`:
    ```
    DATABASE_URL="mysql://user:password@host:3306/todo_app"
    ```
3. Run:
    ```
    npm install
    npx prisma generate
    npx prisma migrate dev --name init
    npm run dev
    ```
    (Cloud options like PlanetScale also work—just use their connection string and `run npx prisma migrate deploy` for production.)

---

### Production notes
- Build:
    ```
    npm run build
    ```
- Run: 
    ```
    npm start
    # which runs: node dist/index.js
    ```
- Apply migrations in production:
    ```
    npx prisma migrate deploy
    ```
- Set a real `CORS_ORIGIN` and a secure `DATABASE_URL` in your production environment variables

--- 

### Common Issues & Fixes
- `ECONNREFUSED` / **“Prisma can’t connect”**
Docker not running, or MySQL container not up yet. Run docker compose up -d and wait ~5–10 seconds.

- **Port 3306 already in use**
Another MySQL is running. Stop it or change the port mapping in docker-compose.yml and .env.

- `npx prisma migrate dev` **asks to reset**
You changed the schema; Prisma wants to re-sync. In dev this is fine, in prod you’d use migrate deploy.

- **CORS errors in the browser**
Your frontend URL doesn’t match CORS_ORIGIN. Update .env and restart npm run dev.

- **Node version mismatch**
Ensure Node 18+ (node -v).
