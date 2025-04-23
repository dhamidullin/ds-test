// Mock the TaskRepository module
jest.mock('../../../repositories/taskRepository', () => {
  return {
    TaskRepository: jest.fn().mockImplementation(() => {
      return {
        listAllTasks: jest.fn(),
        createTask: jest.fn(),
        getTaskById: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn(),
      };
    }),
  };
});

// Optionally, mock the TaskModel or Sequelize if needed
jest.mock('../../../models/TaskModel', () => {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  };
});

// Import the TaskService after mocking
import { TaskService } from '../../../services/taskService';
import { TaskRepository } from '../../../repositories/taskRepository';
import { Task } from '@shared/types/task';
import { CreateTaskInput, UpdateTaskInput } from '../../../validators/task';

// Now you can proceed with your tests
let mockRepository: jest.Mocked<TaskRepository>;
let service: TaskService;

beforeEach(() => {
  mockRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
  service = new TaskService(mockRepository);

  jest.clearAllMocks();
});

describe('TaskService', () => {
  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks: Task[] = [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 2, title: 'Task 2', description: 'Desc 2', completed: true, createdAt: '2024-01-02', updatedAt: '2024-01-02' }
      ];

      mockRepository.listAllTasks.mockResolvedValue(mockTasks);

      const result = await service.getAllTasks();

      expect(mockRepository.listAllTasks).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
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

      mockRepository.createTask.mockResolvedValue(mockTask);

      const result = await service.createTask(input);

      expect(mockRepository.createTask).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockTask);
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

      mockRepository.getTaskById.mockResolvedValue(mockTask);

      const result = await service.getTaskById(1);

      expect(mockRepository.getTaskById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      mockRepository.getTaskById.mockResolvedValue(null);

      const result = await service.getTaskById(1);

      expect(mockRepository.getTaskById).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
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

      mockRepository.updateTask.mockResolvedValue(mockTask);

      const result = await service.updateTask(1, updateData);

      expect(mockRepository.updateTask).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      mockRepository.updateTask.mockResolvedValue(null);

      const result = await service.updateTask(1, { title: 'New Title' });

      expect(mockRepository.updateTask).toHaveBeenCalledWith(1, { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return true', async () => {
      mockRepository.deleteTask.mockResolvedValue(true);

      const result = await service.deleteTask(1);

      expect(mockRepository.deleteTask).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should return false if task not found', async () => {
      mockRepository.deleteTask.mockResolvedValue(false);

      const result = await service.deleteTask(1);

      expect(mockRepository.deleteTask).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});
