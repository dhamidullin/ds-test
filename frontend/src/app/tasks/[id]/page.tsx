import { tasksApi } from "@/lib/api";
import { redirect } from 'next/navigation';
import TaskView from "./TaskView";
import React from "react";

interface TaskPageProps {
  params: Promise<{ id: string }>
}

const TaskPage: React.FC<TaskPageProps> = async ({ params }) => {
  const { id } = await params;
  const { data: task, error } = await tasksApi.getById(Number(id));

  // Handle error cases
  if (error?.status === 404) {
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

  if (error) {
    return (
      <div className="text-red-600 font-medium p-4 bg-red-50 border border-red-200 rounded-md">
        Error: {error.message}
      </div>
    )
  }

  if (!task) {
    return redirect('/tasks')
  }

  return <TaskView task={task} />
}

export default TaskPage