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

const useTaskUpdater = (taskId: number, taskQuery: ReturnType<typeof useTask>, taskEditMutation: ReturnType<typeof useUpdateTask>) => {
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

  return { handleUpdate }
}

interface EditTaskProps {
  taskId: number
  initialData: Task
}

const EditTask: React.FC<EditTaskProps> = ({ taskId, initialData }) => {
  const router = useRouter()
  const taskQuery = useTask(taskId)
  const taskEditMutation = useUpdateTask(taskId)

  const { handleUpdate } = useTaskUpdater(taskId, taskQuery, taskEditMutation)
  const handleCancel = () => router.push('/tasks')

  if (taskQuery.error) {
    return <ErrorLoadingTask message={taskQuery.error.message} />
  }

  const displayTaskData: Task = taskQuery.data || initialData

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
          {displayTaskData.title}
        </h1>
      </div>

      <TaskForm
        mode="edit"
        initialData={displayTaskData}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isSubmitting={taskEditMutation.isMutating}
      />
    </div>
  )
}

const ErrorLoadingTask: React.FC<{ message: string }> = ({ message }) => (
  <div className="container mx-auto px-4 py-8">
    Error loading task: {message}
  </div>
)

export default EditTask

// interface PageProps {
//   params: Promise<{ id: string }>
// }

// const EditTaskPageContent: FC<{ taskId: number }> = ({ taskId }) => {
//   const router = useRouter()

//   const { data: task, error: fetchError, isLoading, mutate: localTaskMutate } = useTask(taskId)
//   const { trigger: updateTaskTrigger, isMutating: isUpdatingTask } = useUpdateTask(taskId)

//   useEffect(() => {
//     if (fetchError) {
//       console.error('Error fetching task:', fetchError)
//       const status = (fetchError as any).status
//       if (status === 404) {
//         toast.error('This task does not exist')
//         router.push('/tasks')
//       } else {
//         toast.error(`Failed to load task: ${fetchError.message || 'An unknown error occurred'}`)
//       }
//     }
//   }, [fetchError, router])

//   const handleUpdate = async (formData: TaskFormData) => {
//     if (!task) return

//     const updatePayload: TaskUpdateData = pick(formData, ['title', 'description', 'completed'])

//     const optimisticData: Task = {
//       ...task,
//       ...updatePayload,
//       completed: formData.completed ?? task.completed ?? false,
//     }

//     localTaskMutate(optimisticData, { revalidate: false })

//     try {
//       const args: UpdateTaskArgs = { id: taskId, payload: updatePayload };
//       await updateTaskTrigger(args)

//       toast.success('Changes saved successfully')
//     } catch (error: any) {
//       console.error('Error updating task:', error)

//       localTaskMutate(task, { revalidate: false })

//       if (error.status && error.status < 500) {
//         toast.error(`Failed to save changes: ${error.message}`)
//       } else {
//         toast.error(`Failed to save changes: ${error.message || 'An unknown server error occurred'}`)
//       }
//     }
//   }

//   const handleCancel = () => {
//     router.push('/tasks')
//   }

//   if (isLoading) {
//     return <div className="container mx-auto px-4 py-8">Loading task details...</div>
//   }

//   if (fetchError) {
//     return <div className="container mx-auto px-4 py-8">Error loading task: {fetchError.message}</div>
//   }

//   if (!task) {
//     return <div className="container mx-auto px-4 py-8">Task not found or data is unavailable.</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center gap-2 mb-6">
//         <button
//           onClick={handleCancel}
//           className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
//           aria-label="Back to tasks"
//         >
//           <BackArrowIcon />
//         </button>

//         <h1 className="text-2xl font-bold">{task.title}</h1>
//       </div>

//       <TaskForm
//         mode="edit"
//         initialData={task}
//         onSubmit={handleUpdate}
//         onCancel={handleCancel}
//         isSubmitting={isUpdatingTask}
//       />
//     </div>
//   )
// }

// const EditTaskPage: FC<PageProps> = ({ params }) => {
//   const router = useRouter()
//   const [taskId, setTaskId] = useState<number | null>(null)

//   useEffect(() => {
//     params.then(p => {
//       const idNumber = Number(p.id)

//       if (isNaN(idNumber)) {
//         console.error('Invalid task ID in URL parameter:', p.id)
//         toast.error('Invalid task ID provided.')
//         router.push('/tasks')
//       } else {
//         setTaskId(idNumber)
//       }
//     }).catch(error => {
//       console.error('Error processing URL parameters:', error)
//       toast.error('Could not load task details due to a parameter processing error.')
//       router.push('/tasks')
//     })
//   }, [params, router])

//   if (taskId === null) {
//     return <div className="container mx-auto px-4 py-8">Loading...</div>
//   }

//   return <EditTaskPageContent taskId={taskId} />
// }

// export default EditTaskPage
