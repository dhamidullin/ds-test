'use client'

import { Task } from '@shared/types/task'
import { tasksApi } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'

interface TasksContentProps {
  initialTasks: Task[]
}

export default function TasksContent({ initialTasks }: TasksContentProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleDelete = async (taskId: number) => {
    const deleteTask = async () => {
      try {
        await tasksApi.delete(taskId)
        setTasks(tasks.filter(task => task.id !== taskId))
      } catch (error) {
        console.error('Failed to delete task:', error)
        throw error
      }
    }

    toast.custom((t) => (
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Task</h3>
        <p className="text-gray-500 mb-4">Are you sure you want to delete this task?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t)
              toast.promise(deleteTask(), {
                loading: 'Deleting task...',
                success: 'Task deleted successfully',
                error: 'Failed to delete task',
              })
            }}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  }

  // empty state
  if (tasks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-4">No tasks yet</p>
          <a
            href="/tasks/new"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create your first task
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <a
          href="/tasks/new"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Task
        </a>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h2>
                {task.description && (
                  <p className="text-gray-600">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${task.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`/tasks/${task.id}/edit`}
                    className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </a>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
