import { Container } from 'inversify';
import { types } from '../../../types';
import type { TaskController } from '../../../controllers/taskController';
import request from 'supertest';

// Mock the container
jest.mock('../../../container', () => {
  const mockContainer = new Container();
  // bind the mocked controller to the container so it works in the router
  mockContainer.bind<TaskController>(types.TaskController).toConstantValue(mockTaskController as unknown as TaskController);
  return mockContainer;
});

// Mock the TaskController
jest.mock('../../../controllers/taskController');

// Create mock controller instance
const mockTaskController = {
  getAllTasks: jest.fn((req, res) => res.status(200).json([])),
  createTask: jest.fn((req, res) => res.status(201).json({})),
  getTaskById: jest.fn((req, res) => res.status(200).json({})),
  updateTask: jest.fn((req, res) => res.status(200).json({})),
  deleteTask: jest.fn((req, res) => res.status(204).end()),
};

import express from 'express';
import tasksRouter from '../../../routes/tasksRouter';

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);

describe('tasksRouter', () => {
  it('should call getAllTasks on GET /tasks', async () => {
    await request(app).get('/tasks').expect(200);
    expect(mockTaskController.getAllTasks).toHaveBeenCalled();
  });

  it('should call createTask on POST /tasks', async () => {
    await request(app).post('/tasks').send({ title: 'Test Task', description: 'Test Description' }).expect(201);
    expect(mockTaskController.createTask).toHaveBeenCalled();
  });

  it('should call getTaskById on GET /tasks/:id', async () => {
    await request(app).get('/tasks/1').expect(200);
    expect(mockTaskController.getTaskById).toHaveBeenCalled();
  });

  it('should call updateTask on PUT /tasks/:id', async () => {
    await request(app).put('/tasks/1').send({ title: 'Updated Task' }).expect(200);
    expect(mockTaskController.updateTask).toHaveBeenCalled();
  });

  it('should call deleteTask on DELETE /tasks/:id', async () => {
    await request(app).delete('/tasks/1').expect(204);
    expect(mockTaskController.deleteTask).toHaveBeenCalled();
  });
});
