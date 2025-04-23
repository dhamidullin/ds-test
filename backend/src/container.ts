/**
 * Set up the dependency injection container using Inversify.
 * Bind repositories, services, and controllers for future use.
 */

import { Container } from 'inversify';
import { TaskRepository } from './repositories/taskRepository';
import { TaskService } from './services/taskService';
import { TaskController } from './controllers/taskController';
import { types } from './types';

const container = new Container();

// repositories
container.bind<TaskRepository>(types.TaskRepository).to(TaskRepository).inSingletonScope();

// services
container.bind<TaskService>(types.TaskService).to(TaskService).inSingletonScope();

// controllers
container.bind<TaskController>(types.TaskController).to(TaskController).inSingletonScope();

export default container;
