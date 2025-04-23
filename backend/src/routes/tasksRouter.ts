import { Router } from 'express';
import container from '../container';
import { types } from '../types';
import type { TaskController } from '../controllers/taskController';

const router = Router();
const taskController = container.get<TaskController>(types.TaskController);

router.get('/', taskController.getAllTasks.bind(taskController));
router.post('/', taskController.createTask.bind(taskController));
router.get('/:id', taskController.getTaskById.bind(taskController));
router.put('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
