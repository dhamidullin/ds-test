// Mock the TaskModel module
jest.mock('../../../models/TaskModel', () => {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    // Add any other methods you need to mock
  };
});

// Now import the TaskRepository after mocking
import { TaskRepository } from '../../../repositories/taskRepository';
import TaskModel from '../../../models/TaskModel';
import { Task } from '@shared/types/task';
import { CreateTaskInput, UpdateTaskInput } from '../../../validators/task';

let repository: TaskRepository;

beforeEach(() => {
  repository = new TaskRepository();
  jest.clearAllMocks();
});

describe('TaskRepository', () => {
  describe('listAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Task 2', description: 'Desc 2', completed: true, createdAt: new Date(), updatedAt: new Date() }
      ];

      (TaskModel.findAll as jest.Mock).mockResolvedValue(mockTasks);

      const result = await repository.listAllTasks();

      expect(TaskModel.findAll).toHaveBeenCalledWith({ order: [['createdAt', 'DESC']] });
      expect(result).toEqual(mockTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      })));
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const input: CreateTaskInput = { title: 'New Task', description: 'New Description' };
      const mockTask = {
        id: 1,
        ...input,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (TaskModel.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await repository.createTask(input);

      expect(TaskModel.create).toHaveBeenCalledWith({ ...input, completed: false });
      expect(result).toEqual({
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        completed: mockTask.completed,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString()
      });
    });
  });

  describe('getTaskById', () => {
    it('should return task if found', async () => {
      const mockTask = {
        id: 1,
        title: 'Task',
        description: 'Desc',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (TaskModel.findByPk as jest.Mock).mockResolvedValue(mockTask);

      const result = await repository.getTaskById(1);

      expect(TaskModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        completed: mockTask.completed,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString()
      });
    });

    it('should return null if task not found', async () => {
      (TaskModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await repository.getTaskById(1);

      expect(TaskModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task if found', async () => {
      const updateData: UpdateTaskInput = { title: 'New Title', description: 'New Desc' };
      const mockTask = {
        id: 1,
        title: 'Task',
        description: 'Desc',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        update: jest.fn().mockImplementation((data) => { // proper mocking of the update method
          Object.assign(mockTask, data);
          return Promise.resolve(mockTask);
        })
      };

      (TaskModel.findByPk as jest.Mock).mockResolvedValue(mockTask);

      const result = await repository.updateTask(1, updateData);

      expect(TaskModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockTask.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({
        id: mockTask.id,
        title: updateData.title,
        description: updateData.description,
        completed: mockTask.completed,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString()
      });
    });

    it('should return null if task not found', async () => {
      (TaskModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await repository.updateTask(1, { title: 'New Title' });

      expect(TaskModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return true', async () => {
      const mockTask = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(undefined)
      };

      (TaskModel.findByPk as jest.Mock).mockResolvedValue(mockTask);

      const result = await repository.deleteTask(1);

      expect(TaskModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockTask.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if task not found', async () => {
      (TaskModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await repository.deleteTask(1);

      expect(TaskModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});
