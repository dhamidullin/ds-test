'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await tasksApi.getById(Number(params.id))
        setTask(response)
      } catch (error) {
        console.error('Error fetching task:', error)
        alert('Failed to load task')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task) return

    setIsSubmitting(true)

    try {
      const updatedTask = await tasksApi.update(Number(params.id), {
        title: task.title,
        description: task.description,
        completed: task.completed,
      })

      setTask(updatedTask)
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Failed to update task')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!task) {
    return <div className="container mx-auto px-4 py-8">Task not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.push('/tasks')}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Edit Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={task.description || ''}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => setTask({ ...task, completed: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/tasks')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 