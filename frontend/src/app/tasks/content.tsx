'use client'

import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'
import { useState } from 'react'

interface TasksContentProps {
  initialTasks: Task[]
}

export default function TasksContent({ initialTasks }: TasksContentProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleDelete = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(taskId)
        setTasks(tasks.filter(task => task.id !== taskId))
      } catch (error) {
        console.error('Failed to delete task:', error)
        alert('Failed to delete task. Please try again.')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <a
          href="/tasks/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Task
        </a>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border p-4 rounded shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                {task.description && (
                  <p className="text-gray-600 mt-2">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                <a
                  href={`/tasks/${task.id}/edit`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </a>
                <button
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
