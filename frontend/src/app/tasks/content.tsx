'use client'

import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'
import { useState } from 'react'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'
import { NewTaskButton } from './NewTaskButton'
import { showDeleteConfirmationToast } from './DeleteConfirmationToast'

interface TasksContentProps {
  initialTasks: Task[]
}

export default function TasksContent({ initialTasks }: TasksContentProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleDelete = async (taskId: number) => {
    const deleteTask = async () => {
      try {
        await tasksApi.delete(taskId)
        setTasks(tasks.filter(task => task.id !== taskId))
      } catch (error) {
        console.error('Failed to delete task:', error)
        throw error
      }
    }

    showDeleteConfirmationToast({ onConfirm: deleteTask })
  }

  // empty state
  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <NewTaskButton />
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
