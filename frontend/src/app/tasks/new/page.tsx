'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { tasksApi } from '@/lib/api'
import TaskForm from '@/components/forms/TaskForm'

export default function NewTaskPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreateSubmit(formData: { title: string; description: string }) {
    setIsSubmitting(true)

    try {
      const newTask = await tasksApi.create({ title: formData.title, description: formData.description })

      router.push(`/tasks/${newTask.id}/edit`)
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/tasks')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleCancel}
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
        <h1 className="text-2xl font-bold">New Task</h1>
      </div>

      <TaskForm
        mode="create"
        onSubmit={handleCreateSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  )
} 