'use client'

import TaskForm from "@/components/forms/TaskForm"
import BackArrowIcon from '@/components/ui/BackArrowIcon'
import { Task } from "@shared/types/task"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { pick } from 'lodash'
import { TaskFormData } from '@/components/forms/TaskForm'
import { TaskUpdateData } from '@shared/types/task'
import { useTask } from '@/lib/queries'
import { useUpdateTask, UpdateTaskArgs } from '@/lib/mutations'
import { SWRConfig } from "swr"

const useEditTask = (taskId: number, initialData: Task) => {
  const router = useRouter()

  const taskQuery = useTask(taskId)
  const taskEditMutation = useUpdateTask(taskId)

  const handleUpdate = async (formData: TaskFormData) => {
    const oldData = taskQuery.data
    if (!oldData) return

    const updatePayload: TaskUpdateData = pick(formData, ['title', 'description', 'completed'])

    const optimisticData: Task = {
      ...oldData,
      ...updatePayload,
      completed: formData.completed ?? oldData.completed ?? false,
    }

    taskQuery.mutate(optimisticData, { revalidate: false })

    try {
      const args: UpdateTaskArgs = { id: taskId, payload: updatePayload };
      await taskEditMutation.trigger(args)

      toast.success('Changes saved successfully')
    } catch (error: any) {
      console.error('Error updating task:', error)

      taskQuery.mutate(taskQuery.data, { revalidate: false })

      if (error.status && error.status < 500) {
        toast.error(`Failed to save changes: ${error.message}`)
      } else {
        toast.error(`Failed to save changes: ${error.message || 'An unknown server error occurred'}`)
      }
    }
  }

  const handleCancel = () => router.push('/tasks')

  return {
    taskQueryError: taskQuery.error,
    isMutating: taskEditMutation.isMutating,
    taskData: taskQuery.data || initialData,
    handleUpdate,
    handleCancel,
  }
}

function EditTask({ taskId, initialData }: { taskId: number, initialData: Task }) {
  const { taskData, taskQueryError, isMutating, handleUpdate, handleCancel } = useEditTask(taskId, initialData)

  if (taskQueryError) {
    return (
      <div className="container mx-auto px-4 py-8">
        Error loading task: {taskQueryError.message}
      </div>
    )
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

        <h1 className="text-2xl font-bold">
          {taskData.title}
        </h1>
      </div>

      <TaskForm
        mode="edit"
        initialData={taskData}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isSubmitting={isMutating}
      />
    </div>
  )
}

export default (params: Parameters<typeof EditTask>[0]) => (
  <SWRConfig value={{
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
    refreshInterval: 0,
  }}>
    <EditTask {...params} />
  </SWRConfig>
)
