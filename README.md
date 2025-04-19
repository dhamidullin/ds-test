# Digital Suits Test Project

A monorepo project with Next.js frontend and Express.js backend.

## Production Deployment with Docker
```bash
cp .env.example .env
docker-compose up -d --build
```

This will start:
- Nginx reverse proxy at `http://localhost:5643`
- Frontend (accessible through Nginx)
- Backend API (accessible through Nginx)
- Database synchronization service (runs once to sync schema)
- PostgreSQL database (exposed at port 5432 so it can be used by dev server too)
- pgAdmin for database management at `http://localhost:5050` (use pg address to connect)

Nginx will redirect all /api requests to the backend and the rest to the frontend.

To update the deployment with new changes:
```bash
docker-compose up -d --build
```
This command will:
- Build new images for all services
- Replace running containers with new ones
- Keep the application running during the update
- Run everything in detached mode (-d flag)

To manually re-sync the database schema:
```bash
docker-compose up db-sync
```

## Local Development Setup

1. **Environment Setup**
   ```bash
   # Copy environment file for backend
   cp backend/.env.example backend/.env
   ```
   Then edit `backend/.env` and set your database URL.

2. **Install Dependencies**
   ```bash
   # Install backend and frontend dependencies
   cd backend && yarn && cd ../frontend && yarn && cd ..
   ```

4. **Start Development Servers**
   ```bash
   # Start backend server (from backend directory)
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/digital_suits yarn dev

   # In a new terminal, start frontend server (from frontend directory)
   cd ../frontend
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

   > **Note:** Make sure the PostgreSQL database container is running (`docker-compose up -d postgres`) before starting the development servers or use a different database url. 

## Development

To rebuild and replace all containers while keeping the application running:
```bash
docker-compose up -d --build
```

This will:
- Build new images for all services
- Replace running containers with new ones
- Keep the application running during the process
- Run everything in detached mode (-d flag)

To remove ALL including volumes (database data):
```bash
docker-compose down -v
```
