export const dynamic = 'force-dynamic'

import { tasksApi } from '@/lib/api'
import { Metadata } from 'next'
import TasksPageContent from './_components/TasksPageContent'

export const metadata: Metadata = {
  title: 'Tasks',
}

async function getTasks() {
  const response = await tasksApi.getAll()
  return response
}

export default async function TasksPage() {
  const { data: tasks, error } = await getTasks()

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
          Error loading tasks: {error.message} (Status: {error.status || 'N/A'})
        </div>
      </div>
    )
  }

  if (!tasks) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <div className="p-4 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded">
          No tasks data available.
        </div>
      </div>
    )
  }

  return <TasksPageContent initialTasks={tasks} />
}
