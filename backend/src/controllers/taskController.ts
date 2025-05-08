import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { CreateTaskInput, UpdateTaskInput, createTaskSchema, updateTaskSchema, taskIdSchema } from '../validators/task';
import type { TaskService } from '../services/taskService';
import { types } from '../types';

@injectable()
export class TaskController {
  constructor(@inject(types.TaskService) private readonly taskService: TaskService) { }

  async getAllTasks(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  async createTask(req: Request<{}, {}, CreateTaskInput>, res: Response): Promise<void> {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const task = await this.taskService.createTask(validatedData);
      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create task' });
      }
    }
  }

  async getTaskById(req: Request<{ id: number }>, res: Response): Promise<void> {
    try {
      const { id } = taskIdSchema.parse({ id: req.params.id });

      const task = await this.taskService.getTaskById(id);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch task' });
      }
    }
  }

  async updateTask(req: Request<{ id: number }, {}, UpdateTaskInput>, res: Response): Promise<void> {
    try {
      const { id } = taskIdSchema.parse({ id: req.params.id });
      const validatedData = updateTaskSchema.parse(req.body);
      const task = await this.taskService.updateTask(id, validatedData);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update task' });
      }
    }
  }

  async deleteTask(req: Request<{ id: number }>, res: Response): Promise<void> {
    try {
      const { id } = taskIdSchema.parse({ id: req.params.id });
      const success = await this.taskService.deleteTask(id);
      if (!success) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete task' });
      }
    }
  }
}
