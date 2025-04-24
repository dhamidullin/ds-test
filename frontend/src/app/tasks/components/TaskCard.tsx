import { Task } from '@shared/types/task'
import TrashCanButton from '@/app/tasks/components/TrashCanButton'
import EditButton from '@/app/tasks/components/EditButton'
import { memo } from 'react'

interface TaskCardProps {
  task: Task
  onDelete?: (taskId: number) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete = () => { } }) => {
  const taskCompletionStatusClassName = task.completed
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="group border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h2>

          <p className="text-gray-600">{task.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${taskCompletionStatusClassName}`} >
            {task.completed ? 'Completed' : 'Pending'}
          </span>

          <div className="flex items-center gap-2">
            <EditButton href={`/tasks/${task.id}/edit`} />
            <TrashCanButton onClick={() => onDelete(task.id)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TaskCard)
