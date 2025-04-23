import { injectable, inject } from 'inversify';
import { Task } from '@shared/types/task';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task';
import { types } from '../types';
import type { TaskRepository } from '../repositories/taskRepository';

@injectable()
export class TaskService {
  constructor(
    @inject(types.TaskRepository) private readonly taskRepository: TaskRepository
  ) { }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.listAllTasks();
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    return this.taskRepository.createTask(data);
  }

  async getTaskById(id: number): Promise<Task | null> {
    return this.taskRepository.getTaskById(id);
  }

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task | null> {
    return this.taskRepository.updateTask(id, data);
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.taskRepository.deleteTask(id);
  }
}
