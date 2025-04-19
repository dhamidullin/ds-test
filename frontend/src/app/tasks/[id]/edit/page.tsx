'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'
import { toast } from 'sonner'
import { pick } from 'lodash'
import useSWR from 'swr'
import { SaveButton } from '@/components/ui/SaveButton'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

interface ActionState {
  error: string | null
  success: boolean
}

export default function EditTaskPage({ params }: PageProps) {
  const router = useRouter()
  const [rippleStyle, setRippleStyle] = useState<{ left: number; top: number } | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setTaskId(p.id))
  }, [params])

  // Use SWR for data fetching
  const { data: task, error: fetchError, isLoading, mutate } = useSWR(
    taskId ? `/tasks/${taskId}` : null,
    () => tasksApi.getById(Number(taskId)),
    {
      onError: (error) => {
        console.error('Error fetching task:', error)
        toast.error('Failed to load task')
      },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      refreshInterval: 0,
    }
  )

  const [state, submitAction, isPending] = useActionState(
    async (currentState: ActionState, formData: FormData) => {
      if (!task) return { ...currentState, error: 'Task not found' }

      try {
        const updatedTask = {
          ...task,
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          completed: formData.get('completed') === 'on',
        }

        // optimistic update
        mutate(updatedTask, false)

        // Make the actual API call
        const update = pick(updatedTask, ['title', 'description', 'completed'])
        const response = await tasksApi.update(Number(taskId), update)

        toast.success('Changes saved successfully')
        return { error: null, success: true }
      } catch (error) {
        toast.error('Failed to save changes')
        return { ...currentState, error: 'Failed to update task' }
      }
    },
    { error: null, success: false }
  )

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRippleStyle({ left: x, top: y })

    // Remove ripple after animation
    setTimeout(() => setRippleStyle(null), 600)
  }

  if (!taskId || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (fetchError || !task) {
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

        {/* it's the only place yet where we can observe the optimistic UI update */}
        <h1 className="text-2xl font-bold">{task.title}</h1>
      </div>

      {state.error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {state.error}
        </div>
      )}

      <form action={submitAction} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={task.title}
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
            name="description"
            defaultValue={task.description || ''}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              defaultChecked={task.completed}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </label>
        </div>

        <div className="flex gap-2">
          <SaveButton isPending={isPending} onClick={handleButtonClick} />
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