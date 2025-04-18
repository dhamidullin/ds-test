export const dynamic = 'force-dynamic'

import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'
import { Metadata } from 'next'
import TasksContent from './content'

export const metadata: Metadata = {
  title: 'Tasks',
  description: '',
};

async function getTasks(): Promise<Task[]> {
  const response = await tasksApi.getAll()
  return response
}

export default async function TasksPage() {
  const tasks = await getTasks()

  return <TasksContent initialTasks={tasks} />
}
