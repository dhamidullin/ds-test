export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskCreationData = Pick<Task, 'title' | 'description'>
export type TaskUpdateData = Partial<Pick<Task, 'title' | 'description' | 'completed'>>
