import { tasksApi } from "@/lib/api";
import React, { Suspense } from "react";
import TaskEditPage from "./TaskEditPage";
import { redirect } from 'next/navigation'

const EditTaskPage: React.FC<{ params: Promise<{ id: string }> }> = async ({ params: paramsPromise }) => {
  const params = await paramsPromise;

  const fallbackUI = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <Suspense fallback={fallbackUI}>
      <TaskContent id={params.id} />
    </Suspense>
  )
}

const TaskContent: React.FC<{ id: string }> = async ({ id }: { id: string }) => {
  const taskData = await tasksApi.getById(Number(id));

  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 300)); // for suspense to be visible on dev
  }

  if (taskData.error?.status === 404) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Task Not Found</h2>
        <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been removed.</p>
        <a href="/tasks" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
          Return to Tasks
        </a>
      </div>
    )
  }

  if (taskData.error) {
    return (
      <div className="text-red-600 font-medium p-4 bg-red-50 border border-red-200 rounded-md">
        Error: {taskData.error.message}
      </div>
    )
  }

  if (!taskData.data) {
    return redirect('/tasks')
  }

  return <TaskEditPage taskId={taskData.data.id} initialData={taskData.data} />
}

export default EditTaskPage
