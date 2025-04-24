'use client'

import { useState, useEffect, FC } from 'react'
import { useRouter } from 'next/navigation'
import { tasksApi } from '@/lib/api'
import { toast } from 'sonner'
import { pick } from 'lodash'
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm'
import BackArrowIcon from '@/components/ui/BackArrowIcon'
import { Task } from '@shared/types/task'
import { useTask } from './useTask'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const EditTaskPage: FC<PageProps> = ({ params }) => {
  const router = useRouter()
  const [taskId, setTaskId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    params.then(p => setTaskId(Number(p.id)))
  }, [params])

  const { task, fetchError, isLoading, mutate } = useTask(taskId);

  const handleUpdateSubmit = async (formData: TaskFormData) => {
    if (!task || !taskId) return;

    setIsSubmitting(true)

    const updatePayload = pick(formData, ['title', 'description', 'completed'])

    const optimisticData: Task = {
      ...task,
      ...updatePayload,
      completed: formData.completed ?? task.completed ?? false,
    };

    mutate(optimisticData, false)

    const { data: _updatedTask, error: updateError } = await tasksApi.update(taskId, updatePayload)

    setIsSubmitting(false)

    if (updateError) {
      console.error('Error updating task:', updateError)

      if (updateError.status && updateError.status < 500) {
        toast.error(`Failed to save changes: ${updateError.message}`)
      }

      mutate(task, false)
    } else {
      toast.success('Changes saved successfully')
    }
  }

  const handleCancel = () => {
    router.push('/tasks')
  }

  if (!taskId || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (fetchError && fetchError.status !== 404) {
    return <div className="container mx-auto px-4 py-8">Error loading task: {fetchError.message}</div>
  }

  if (!task) {
    return <div className="container mx-auto px-4 py-8">Task not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          aria-label="Back to tasks"
        >
          <BackArrowIcon />
        </button>

        <h1 className="text-2xl font-bold">{task.title}</h1>
      </div>

      <TaskForm
        mode="edit"
        initialData={task}
        onSubmit={handleUpdateSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default EditTaskPage
