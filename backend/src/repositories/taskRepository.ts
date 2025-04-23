import { injectable } from 'inversify';
import TaskModel from "../models/TaskModel";
import { CreateTaskInput, UpdateTaskInput } from '../validators/task';
import { Task } from '@shared/types/task';

@injectable()
export class TaskRepository {
  static readonly TYPE = Symbol.for('TaskRepository');

  private convertTaskToDTO(task: TaskModel): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    }
  }

  async listAllTasks(): Promise<Task[]> {
    const tasks = await TaskModel.findAll({
      order: [['createdAt', 'DESC']]
    });

    return tasks.map(this.convertTaskToDTO.bind(this));
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const task = await TaskModel.create({
      ...data,
      completed: false
    });

    return this.convertTaskToDTO(task);
  }

  async getTaskById(id: number): Promise<Task | null> {
    const task = await TaskModel.findByPk(id);
    return task ? this.convertTaskToDTO(task) : null;
  }

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task | null> {
    const task = await TaskModel.findByPk(id);
    if (!task) return null;

    await task.update(data);
    return this.convertTaskToDTO(task);
  }

  async deleteTask(id: number): Promise<boolean> {
    const task = await TaskModel.findByPk(id);
    if (!task) return false;

    await task.destroy();
    return true;
  }
}
