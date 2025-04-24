'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { tasksApi } from '@/lib/api'
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm'
import BackArrowIcon from '@/components/ui/BackArrowIcon'
import { toast } from 'sonner'

export default function NewTaskPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreateSubmit(formData: Pick<TaskFormData, 'title' | 'description'>) {
    setIsSubmitting(true)

    const { data: newTask, error } = await tasksApi.create({ title: formData.title, description: formData.description })

    setIsSubmitting(false)

    if (error) {
      console.error('Error creating task:', error)
      if (error.status !== 500) {
        toast.error(`Failed to create task: ${error.message}`)
      }
    } else if (newTask) {
      toast.success('Task created successfully!')
      router.push(`/tasks/${newTask.id}/edit`)
    } else {
      console.error('API returned null data without an error after create.')
      toast.error('Failed to create task due to an unexpected issue.')
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
          aria-label="Cancel and go back to tasks"
        >
          <BackArrowIcon />
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