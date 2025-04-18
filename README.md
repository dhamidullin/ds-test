# Digital Suits Test Project

A monorepo project with Next.js frontend and Express.js backend.

## Production Deployment with Docker
```bash
docker-compose up -d --build
```

This will start:
- Nginx reverse proxy at `http://localhost:5643`
- Frontend (accessible through Nginx)
- Backend API (accessible at `http://localhost/api`)
- PostgreSQL database
- pgAdmin for database management at `http://localhost:5050`

All API requests from the frontend will be automatically routed to the backend through Nginx.

## Local Development Setup

1. **Environment Setup**
   ```bash
   # Copy environment file for backend
   cp backend/.env.example backend/.env
   ```
   Then edit `backend/.env` and set your database URL.

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   yarn install

   # Install frontend dependencies
   cd ../frontend
   yarn install
   ```

3. **Database Setup**
   ```bash
   # From the backend directory, synchronize database structure
   cd backend
   yarn db:sync
   ```

4. **Start Development Servers**
   ```bash
   # Start backend server (from backend directory)
   yarn dev

   # In a new terminal, start frontend server (from frontend directory)
   cd ../frontend
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`. 