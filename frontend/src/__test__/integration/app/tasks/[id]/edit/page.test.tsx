import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'
import { tasksApi } from '@/lib/api'
import EditTaskPage from '@/app/tasks/[id]/edit/page'
import { toast } from 'sonner'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the API
jest.mock('@/lib/api', () => ({
  tasksApi: {
    getById: jest.fn(),
    update: jest.fn(),
  },
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('EditTaskPage', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  const mockTask = {
    id: 1,
    title: 'Original Title',
    description: 'Original Description',
    completed: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
      ; (useRouter as jest.Mock).mockReturnValue(mockRouter)
      ; (tasksApi.getById as jest.Mock).mockResolvedValue(mockTask)
  })

  it('renders the save changes form with initial values', async () => {
    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    // Wait for the task to load
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Title')).toHaveValue('Original Title')
    expect(screen.getByLabelText('Description')).toHaveValue('Original Description')
    expect(screen.getByLabelText('Completed')).not.toBeChecked()
  })

  it('updates task and shows success toast on successful submission', async () => {
    const updatedTask = {
      ...mockTask,
      title: 'Updated Title',
      description: 'Updated Description',
      completed: true,
    }
      ; (tasksApi.update as jest.Mock).mockResolvedValue(updatedTask)

    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    // Wait for the task to load
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })

    // Update form values
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description' } })
    fireEvent.click(screen.getByLabelText('Completed'))

    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'))

    // Wait for the API call and toast
    await waitFor(() => {
      expect(tasksApi.update).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
      })

      expect(toast.success).toHaveBeenCalledWith('Changes saved successfully')
    })
  })

  it('shows error toast on API failure', async () => {
    ; (tasksApi.update as jest.Mock).mockRejectedValue(new Error('API Error'))

    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    // Wait for the task to load
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })

    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'))

    // Wait for the error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save changes')
    })
  })

  it('navigates back to tasks list when back button is clicked', async () => {
    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    // Wait for the task to load
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })

    // Click the back button
    fireEvent.click(screen.getByRole('button', { name: '' }))

    expect(mockRouter.push).toHaveBeenCalledWith('/tasks')
  })
}) 