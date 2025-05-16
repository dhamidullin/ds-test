'use client'

import { Task } from "@shared/types/task"
import { useRouter } from 'next/navigation'
import BackArrowIcon from '@/components/ui/BackArrowIcon'
import { format } from 'date-fns'
import { useTask } from '@/lib/queries'

interface TaskViewProps {
  task: Task
}

const TaskView = ({ task: initialTask }: TaskViewProps) => {
  const router = useRouter()
  const taskQuery = useTask(initialTask.id)

  const displayData = taskQuery.data || initialTask

  const handleBackClick = () => {
    router.push('/tasks')
  }

  const handleEditClick = () => {
    router.push(`/tasks/${displayData.id}/edit`)
  }

  if (taskQuery.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        Error loading task: {taskQuery.error.message}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleBackClick}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          aria-label="Back to tasks"
        >
          <BackArrowIcon />
        </button>

        <h1 className="text-2xl font-bold">{displayData.title}</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          {displayData.description ? (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{displayData.description}</p>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-500 italic">No description provided</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${displayData.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {displayData.completed ? 'Completed' : 'Active'}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Created</h2>
              <p className="mt-1 text-sm text-gray-900">
                {displayData.createdAt ? format(new Date(displayData.createdAt), 'PPP') : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEditClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskView 