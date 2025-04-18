'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOptimistic } from 'react'
import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditTaskPage({ params }: PageProps) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [rippleStyle, setRippleStyle] = useState<{ left: number; top: number } | null>(null)

  const [optimisticTask, updateOptimisticTask] = useOptimistic(
    task,
    (state, newTask: Task) => newTask
  )

  useEffect(() => {
    async function fetchTask() {
      try {
        const awaitedParams = await params
        const response = await tasksApi.getById(Number(awaitedParams.id))
        setTask(response)
      } catch (error) {
        console.error('Error fetching task:', error)
        setError('Failed to load task')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [])

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRippleStyle({ left: x, top: y })

    // Remove ripple after animation
    setTimeout(() => setRippleStyle(null), 600)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task) return

    setError(null)
    setIsSaving(true)

    try {
      const awaitedParams = await params
      const updatedTask = {
        ...task,
        title: task.title,
        description: task.description,
        completed: task.completed,
      }

      // Optimistically update the UI
      updateOptimisticTask(updatedTask)

      // Make the actual API call
      const response = await tasksApi.update(Number(awaitedParams.id), updatedTask)
      setTask(response)
    } catch (error) {
      console.error('Error updating task:', error)
      setError('Failed to update task')
      // The optimistic update will automatically revert if the API call fails
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!optimisticTask) {
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={optimisticTask.title}
            onChange={(e) => setTask({ ...optimisticTask, title: e.target.value })}
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
            value={optimisticTask.description || ''}
            onChange={(e) => setTask({ ...optimisticTask, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={optimisticTask.completed}
              onChange={(e) => setTask({ ...optimisticTask, completed: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSaving}
            onClick={handleButtonClick}
            className={`
              relative
              bg-blue-500 text-white px-6 py-3 rounded-lg
              hover:bg-blue-600 hover:shadow-lg
              active:bg-blue-700 active:shadow-md
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              group
              overflow-hidden
              active:scale-95
            `}
          >
            {rippleStyle && (
              <span
                className="absolute bg-white/30 rounded-full"
                style={{
                  left: rippleStyle.left,
                  top: rippleStyle.top,
                  width: '0',
                  height: '0',
                  transform: 'translate(-50%, -50%)',
                  animation: 'ripple 0.6s linear',
                }}
              />
            )}
            <span className={`flex items-center gap-2 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>
              Save Changes
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </span>
            {isSaving && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        </div>
      </form>

      <style jsx global>{`
        @keyframes ripple {
          to {
            width: 200%;
            height: 200%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
} 