export const dynamic = 'force-dynamic'

import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'
import { Metadata } from 'next'
import TasksPageContent from './components/TasksPageContent'

export const metadata: Metadata = {
  title: 'Task Manager - list of tasks',
}

async function getTasks(): Promise<Task[]> {
  const response = await tasksApi.getAll()
    .catch((err) => {
      console.error('Error fetching tasks', err)
      throw err
    })
  return response
}

export default async function TasksPage() {
  const tasks = await getTasks().catch((err) => {
    throw new Error('Failed to fetch tasks')
  })

  return <TasksPageContent initialTasks={tasks} />
}
