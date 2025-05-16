'use client'

import React, { useState, useEffect } from 'react'
import RippleButton from '@/components/ui/RippleButton'

// Export the type
export interface TaskFormData {
  title: string
  description: string
  completed: boolean
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData> & { id?: number } // Allow partial data for create, id optional
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
  mode: 'create' | 'edit'
}

type TaskFormState = TaskFormData & {
  errors: {
    title?: string;
  };
}

const useTaskForm = (initialData: TaskFormProps['initialData'], onSubmit: TaskFormProps['onSubmit']) => {
  const [formState, setFormState] = useState<TaskFormState>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    completed: initialData?.completed || false,
    errors: {}
  });

  const validateForm = (): boolean => {
    const errors: TaskFormState['errors'] = {};

    if (!formState.title.trim()) {
      errors.title = 'Title is required';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // update the data if updated initial data is provided
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      title: initialData?.title || prev.title,
      description: initialData?.description || prev.description,
      completed: initialData?.completed ?? prev.completed
    }))
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData: TaskFormData = {
      title: formState.title,
      description: formState.description,
      completed: formState.completed
    }

    if (validateForm()) {
      await onSubmit(formData)
    }
  }

  return {
    formState,
    setFormState,
    handleSubmit
  };
};

const TaskForm = ({ initialData = {}, onSubmit, onCancel, isSubmitting, mode }: TaskFormProps) => {
  const { formState, setFormState, handleSubmit } = useTaskForm(initialData, onSubmit);

  // derived state
  const isCreate = mode === 'create'
  const isEdit = mode === 'edit'
  const submitButtonText = isCreate ? 'Create Task' : 'Save Changes'
  const submittingButtonText = isCreate ? 'Creating...' : 'Saving...'

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>

        <input
          type="text"
          id="title"
          name="title"
          value={formState.title}
          onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
        />
      </div>

      {isEdit && (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={formState.completed}
              onChange={(e) => setFormState(prev => ({ ...prev, completed: e.target.checked }))}
              className="mr-2"
            />

            <span className="text-sm font-medium text-gray-700">
              Completed
            </span>
          </label>
        </div>
      )}

      <div className="flex gap-2">
        <RippleButton
          type="submit"
          isPending={isSubmitting}
        >
          {isSubmitting ? submittingButtonText : submitButtonText}
        </RippleButton>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TaskForm
