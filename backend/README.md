# Backend Service

This is the backend API service for the Digital Suits Test Project.

## Development

To start the development server:
```bash
yarn dev
```

## Environment Variables

Create a `.env` file with the following variables:
```
DATABASE_URL=postgres://username:password@host:port/database
```

## API Documentation

The API provides the following endpoints:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Database

The service uses PostgreSQL with Sequelize as the ORM. Database migrations and models are located in the `src/` directory. 