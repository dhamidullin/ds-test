/**
 * Set up the dependency injection container using Inversify.
 * Bind repositories, services, and controllers for future use.
 */

import { Container } from 'inversify';
import { TaskRepository } from './repositories/taskRepository';
import { TaskService } from './services/taskService';
import { TaskController } from './controllers/taskController';

const container = new Container();

// repositories
container.bind<TaskRepository>(TaskRepository.TYPE).to(TaskRepository).inSingletonScope();

// services
container.bind<TaskService>(TaskService.TYPE).to(TaskService).inSingletonScope();

// controllers
container.bind<TaskController>(TaskController.TYPE).to(TaskController).inSingletonScope();

export default container;
