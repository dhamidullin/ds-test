import request from 'supertest';
import express from 'express';
import tasksRouter from '../../../routes/tasks';
import TaskModel from '../../../models/Task';

// Mock the Task model
jest.mock('../../../models/Task', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);

describe('Tasks Router Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true }
      ];
      (TaskModel.findAll as jest.Mock).mockResolvedValue(mockTasks);

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(TaskModel.findAll).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      (TaskModel.findAll as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const newTask = { title: 'New Task', description: 'Description' };
      const createdTask = { id: 1, ...newTask, completed: false };
      (TaskModel.create as jest.Mock).mockResolvedValue(createdTask);

      const response = await request(app)
        .post('/tasks')
        .send(newTask);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(createdTask);
      expect(TaskModel.create).toHaveBeenCalledWith({
        ...newTask,
        completed: false
      });
    });

    it('should validate input data', async () => {
      const invalidTask = { title: '' }; // Empty title

      const response = await request(app)
        .post('/tasks')
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(TaskModel.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a specific task', async () => {
      const mockTask = { id: 1, title: 'Task 1', completed: false };
      (TaskModel.findByPk as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app).get('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTask);
      expect(TaskModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return 404 for non-existent task', async () => {
      (TaskModel.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/tasks/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const existingTask = { id: 1, title: 'Old Title', completed: false };
      const updateData = { title: 'New Title' };
      const updatedTask = {
        ...existingTask,
        ...updateData
      };

      const update = jest.fn().mockImplementation(async (data) => {
        Object.assign(theTask, data);
      });

      const theTask = {
        ...existingTask,
        update
      };

      (TaskModel.findByPk as jest.Mock).mockResolvedValue(theTask);

      const response = await request(app)
        .put('/tasks/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(update).toHaveBeenCalledWith(updateData);
    });

    it('should validate update data', async () => {
      const invalidUpdate = { title: '' }; // Empty title

      const response = await request(app)
        .put('/tasks/1')
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(TaskModel.update).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const mockTask = { id: 1, title: 'Task 1', completed: false };

      const destroy = jest.fn().mockResolvedValue(1);

      (TaskModel.findByPk as jest.Mock).mockResolvedValue({
        ...mockTask,
        destroy
      });

      const response = await request(app).delete('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Task deleted successfully' });
      expect(destroy).toHaveBeenCalled();
    });

    it('should return 404 for non-existent task', async () => {
      (TaskModel.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/tasks/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
      expect(TaskModel.destroy).not.toHaveBeenCalled();
    });
  });
});
