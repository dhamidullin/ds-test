import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import container from '../container';

const router = Router();
const taskController = container.get<TaskController>(TaskController.TYPE);

router.get('/', taskController.getAllTasks.bind(taskController));
router.post('/', taskController.createTask.bind(taskController));
router.get('/:id', taskController.getTaskById.bind(taskController));
router.put('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
