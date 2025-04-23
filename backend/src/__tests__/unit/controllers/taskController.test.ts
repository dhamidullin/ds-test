import { TaskController } from '../../../controllers/taskController';
import { TaskService } from '../../../services/taskService';
import { Task } from '@shared/types/task';
import { CreateTaskInput, UpdateTaskInput } from '../../../validators/task';
import { Request, Response } from 'express';

jest.mock('../../../services/taskService');

// Helper function to create a mock request with a numeric ID
const createMockRequest = (params: { id: number }, body?: any) => ({
  params,
  body,
  query: {},
  headers: {},
  get: jest.fn(),
  header: jest.fn(),
  accepts: jest.fn(),
  acceptsCharsets: jest.fn(),
  acceptsEncodings: jest.fn(),
  acceptsLanguages: jest.fn(),
  range: jest.fn(),
  app: {} as any,
  baseUrl: '',
  cookies: {},
  fresh: true,
  hostname: '',
  ip: '',
  ips: [],
  method: 'GET',
  originalUrl: '',
  path: '',
  protocol: 'http',
  secure: false,
  signedCookies: {},
  stale: false,
  subdomains: [],
  xhr: false,
  is: jest.fn(),
  res: {} as any,
  next: jest.fn()
} as unknown as Request<{ id: number }>);

describe('TaskController', () => {
  let controller: TaskController;
  let mockService: jest.Mocked<TaskService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new TaskService({} as any) as jest.Mocked<TaskService>;
    controller = new TaskController(mockService);

    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks: Task[] = [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 2, title: 'Task 2', description: 'Desc 2', completed: true, createdAt: '2024-01-02', updatedAt: '2024-01-02' }
      ];

      mockService.getAllTasks.mockResolvedValue(mockTasks);

      await controller.getAllTasks(mockRequest as Request, mockResponse as Response);

      expect(mockService.getAllTasks).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle errors', async () => {
      mockService.getAllTasks.mockRejectedValue(new Error('Database error'));

      await controller.getAllTasks(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch tasks' });
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const input: CreateTaskInput = { title: 'New Task', description: 'New Description' };
      const mockTask: Task = {
        id: 1,
        ...input,
        completed: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      mockRequest.body = input;
      mockService.createTask.mockResolvedValue(mockTask);

      await controller.createTask(mockRequest as Request<{}, {}, CreateTaskInput>, mockResponse as Response);

      expect(mockService.createTask).toHaveBeenCalledWith(input);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('should handle validation errors', async () => {
      mockRequest.body = { title: '' }; // Invalid input

      await controller.createTask(mockRequest as Request<{}, {}, CreateTaskInput>, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should handle service errors', async () => {
      mockRequest.body = { title: 'Valid Title', description: 'Valid Description' };
      mockService.createTask.mockRejectedValue({});

      await controller.createTask(mockRequest as Request<{}, {}, CreateTaskInput>, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to create task' });
    });
  });

  describe('getTaskById', () => {
    it('should return task if found', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Task',
        description: 'Desc',
        completed: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      mockService.getTaskById.mockResolvedValue(mockTask);

      await controller.getTaskById(createMockRequest({ id: 1 }), mockResponse as Response);

      expect(mockService.getTaskById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 if task not found', async () => {
      mockService.getTaskById.mockResolvedValue(null);

      await controller.getTaskById(createMockRequest({ id: 1 }), mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should handle validation errors', async () => {
      const request = createMockRequest({ id: NaN });

      await controller.getTaskById(request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should handle service errors', async () => {
      mockService.getTaskById.mockRejectedValue({});

      await controller.getTaskById(createMockRequest({ id: 1 }), mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch task' });
    });
  });

  describe('updateTask', () => {
    it('should update task if found', async () => {
      const updateData: UpdateTaskInput = { title: 'New Title', description: 'New Desc' };
      const mockTask: Task = {
        id: 1,
        title: 'New Title',
        description: 'New Desc',
        completed: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      const request = createMockRequest({ id: 1 }, updateData);

      mockService.updateTask.mockResolvedValue(mockTask);

      await controller.updateTask(request, mockResponse as Response);

      expect(mockService.updateTask).toHaveBeenCalledWith(1, updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 if task not found', async () => {
      const request = createMockRequest({ id: 1 }, { title: 'New Title' });

      mockService.updateTask.mockResolvedValue(null);

      await controller.updateTask(request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should handle validation errors', async () => {
      const request = createMockRequest({ id: NaN }, { title: 'New Title' });

      await controller.updateTask(request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should handle service errors', async () => {
      const request = createMockRequest({ id: 1 }, { title: 'New Title' });

      mockService.updateTask.mockRejectedValue({});

      await controller.updateTask(request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to update task' });
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return success message', async () => {
      mockService.deleteTask.mockResolvedValue(true);

      await controller.deleteTask(createMockRequest({ id: 1 }), mockResponse as Response);

      expect(mockService.deleteTask).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should return 404 if task not found', async () => {
      mockService.deleteTask.mockResolvedValue(false);

      await controller.deleteTask(createMockRequest({ id: 1 }), mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should handle validation errors', async () => {
      const request = createMockRequest({ id: NaN });

      await controller.deleteTask(request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should handle service errors', async () => {
      mockService.deleteTask.mockRejectedValue({});

      await controller.deleteTask(createMockRequest({ id: 1 }), mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to delete task' });
    });
  });
});
