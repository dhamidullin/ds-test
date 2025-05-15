import { Router } from 'express';
import container from '../container';
import { types } from '../types';
import type { TaskController } from '../controllers/taskController';

const router = Router();
const taskController = container.get<TaskController>(types.TaskController);

if (process.env.NODE_ENV === 'development') {
  router.use(async (req, res, next) => {
    console.log('Waiting for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('5 seconds done');
    next();
  })
}

router.get('/', taskController.getAllTasks.bind(taskController));
router.post('/', taskController.createTask.bind(taskController));
router.get('/:id', taskController.getTaskById.bind(taskController));
router.put('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
