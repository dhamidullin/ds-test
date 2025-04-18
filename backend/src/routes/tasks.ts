import { Router } from 'express';
import TaskModel from '../models/Task';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  CreateTaskInput,
  UpdateTaskInput
} from '../validators/task';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const tasks = await TaskModel.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post<{}, {}, CreateTaskInput>('/', async (req, res) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const task = await TaskModel.create({
      ...validatedData,
      completed: false
    });

    res.json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
});

router.get<{ id: number }>('/:id', async (req, res) => {
  try {
    const { id } = taskIdSchema.parse({ id: req.params.id });
    const task = await TaskModel.findByPk(id);

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
});

router.put<{ id: number }, {}, UpdateTaskInput>('/:id', async (req, res) => {
  try {
    const { id } = taskIdSchema.parse({ id: req.params.id });
    const validatedData = updateTaskSchema.parse(req.body);

    const task = await TaskModel.findByPk(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await task.update(validatedData);
    res.json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
});

router.delete<{ id: number }>('/:id', async (req, res) => {
  try {
    const { id } = taskIdSchema.parse({ id: req.params.id });
    const task = await TaskModel.findByPk(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
});

export default router;
