'use client'

import { useState, useEffect, FC } from 'react'
import { useRouter } from 'next/navigation'
import { tasksApi } from '@/lib/api'
import { toast } from 'sonner'
import { pick } from 'lodash'
import useSWR from 'swr'
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm'
import BackArrowIcon from '@/components/ui/BackArrowIcon'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const EditTaskPage: FC<PageProps> = ({ params }) => {
  const router = useRouter()
  const [taskId, setTaskId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setTaskId(p.id))
  }, [params])

  const { data: task, error: fetchError, isLoading, mutate } = useSWR(
    taskId ? `/tasks/${taskId}` : null,
    () => tasksApi.getById(Number(taskId)),
    {
      onError: (error) => {
        if (error?.response?.status === 404) {
          toast.error('This task does not exist')
          router.push('/tasks')
          return
        }

        console.error('Error fetching task:', error)
        toast.error('Failed to load task')
      },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      refreshInterval: 0,
    }
  )

  const handleUpdateSubmit = async (formData: TaskFormData) => {
    if (!task || !taskId)
      throw new Error('No task or taskId')

    setIsSubmitting(true)
    setErrorState(null)

    try {
      const updatedTaskData = {
        ...task,
        title: formData.title,
        description: formData.description,
        completed: formData.completed ?? false,
      }

      mutate(updatedTaskData, false)

      const updatePayload = pick(updatedTaskData, ['title', 'description', 'completed'])
      await tasksApi.update(Number(taskId), updatePayload)

      toast.success('Changes saved successfully')

    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to save changes')
      setErrorState('Failed to update task')
      mutate()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/tasks')
  }

  if (!taskId || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (fetchError || !task) {
    const message = fetchError?.response?.status === 404 ? 'Task not found' : 'Error loading task'
    return <div className="container mx-auto px-4 py-8">{message}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <BackArrowIcon />
        </button>

        <h1 className="text-2xl font-bold">{task.title}</h1>
      </div>

      {errorState && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {errorState}
        </div>
      )}

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
