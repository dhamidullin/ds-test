import { tasksApi } from '@/lib/api'
import { Metadata } from 'next'
import TasksPageContent from './_components/TasksPageContent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tasks',
}

async function getTasks() {
  return await tasksApi.getAll()
}

async function TasksPage() {
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

export default function Page() {
  const fallbackUI = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <Suspense fallback={fallbackUI}>
      <TasksPage />
    </Suspense>
  )
}

