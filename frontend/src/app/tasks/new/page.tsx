'use client'

import { useRouter } from 'next/navigation'
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm'
import BackArrowIcon from '@/components/ui/BackArrowIcon'
import { toast } from 'sonner'
import { useCreateTask } from '@/lib/mutations'
import { TaskCreationData } from '@shared/types/task'

export default function NewTaskPage() {
  const router = useRouter()
  const { trigger: createTaskTrigger, isMutating: isCreatingTask } = useCreateTask()

  async function handleCreateSubmit(formData: Pick<TaskFormData, 'title' | 'description'>) {
    const creationData: TaskCreationData = {
      title: formData.title,
      description: formData.description
    }

    try {
      const newTask = await createTaskTrigger(creationData)
      
      toast.success('Task created successfully!')
      router.push(`/tasks/${newTask.id}/edit`)

    } catch (error: any) {
      console.error('Error creating task:', error)
      if (error.status && error.status !== 500) {
        toast.error(`Failed to create task: ${error.message}`)
      } else if (error.status === 500) {
        toast.error('Failed to create task: Server error.')
      } else {
        toast.error(`Failed to create task: ${error.message || 'An unexpected error occurred.'}`)
      }
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
        isSubmitting={isCreatingTask}
      />
    </div>
  )
} 