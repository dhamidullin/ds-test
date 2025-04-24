import { FC } from 'react'

interface DeleteConfirmationToastProps {
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmationToast: FC<DeleteConfirmationToastProps> = ({ onConfirm, onCancel }) => (
  <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-4">
    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Task</h3>
    <p className="text-gray-500 mb-4">Are you sure you want to delete this task?</p>
    <div className="flex justify-end gap-2">
      <button
        onClick={onCancel}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </div>
)

export default DeleteConfirmationToast
