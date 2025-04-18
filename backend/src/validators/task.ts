import { z } from 'zod';
import { TaskCreationData, TaskUpdateData } from '@shared/types/task';

// Base task schema with common fields
const taskBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  completed: z.boolean().default(false),
});

// Ensure our schemas match the shared types
export const createTaskSchema = taskBaseSchema.omit({ completed: true }).refine(
  (data): data is TaskCreationData => true,
  'Schema must match TaskCreationData type'
);

export const updateTaskSchema = taskBaseSchema.partial().refine(
  (data): data is TaskUpdateData => true,
  'Schema must match TaskUpdateData type'
);

// Schema for task ID in URL params
export const taskIdSchema = z.object({
  id: z.coerce.number().int().positive('Task ID must be a positive number'),
});

// Type inference from schemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>; 
