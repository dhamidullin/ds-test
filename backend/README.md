# Backend

Express.js backend server for the Digital Suits Test Project.

## Features
- RESTful API endpoints
- PostgreSQL database integration
- TypeScript support
- Environment-based configuration

## Development
```bash
# Install dependencies
yarn

# Start development server
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/digital_suits yarn dev # assuming db docker compose service is running

# Run database migrations
yarn db:sync
```

## API Endpoints
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3001)
