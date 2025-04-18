# Digital Suits Test Project

A monorepo project with Next.js frontend and Express.js backend.

## Production Deployment with Docker
```bash
docker-compose up -d --build
```

This will start:
- Nginx reverse proxy at `http://localhost:5643`
- Frontend (accessible through Nginx)
- Backend API (accessible through Nginx)
- PostgreSQL database (exposed at port 5432 so it can be used by dev server too)
- pgAdmin for database management at `http://localhost:5050` (use pg address to connect)

Nginx will redirect all /api requests to the backend and the rest to the frontend.

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