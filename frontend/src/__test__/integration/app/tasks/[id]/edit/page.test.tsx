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
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (tasksApi.getById as jest.Mock).mockResolvedValue({ data: mockTask, error: null });
  })

  it('renders the save changes form with initial values', async () => {
    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('Original Title')
    })
    expect(screen.getByLabelText('Description')).toHaveValue('Original Description')
    expect(screen.getByLabelText('Completed')).not.toBeChecked()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('updates task and shows success toast on successful submission', async () => {
    (tasksApi.update as jest.Mock).mockResolvedValue({ data: { ...mockTask, title: 'Updated Title' }, error: null })
    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description' } })
    fireEvent.click(screen.getByLabelText('Completed'))

    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(tasksApi.update).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
      })
      expect(toast.success).toHaveBeenCalledWith('Changes saved successfully')
    })
  })

  it('shows error toast on API update failure', async () => {
    const apiError = { message: 'API Update Error', status: 500 };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (tasksApi.update as jest.Mock).mockResolvedValue({ data: null, error: apiError })

    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Title' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating task:', apiError)
    })

    consoleErrorSpy.mockRestore();
  })

  it('shows error message on API fetch failure (non-404)', async () => {
    const apiError = { message: 'API Fetch Error', status: 400 };
    (tasksApi.getById as jest.Mock).mockResolvedValue({ data: null, error: apiError });

    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalledWith('Failed to load task: API Fetch Error');
    });
  });

  it('navigates back to tasks list when back button is clicked', async () => {
    render(<EditTaskPage params={Promise.resolve({ id: '1' })} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Back to tasks' }))

    expect(mockRouter.push).toHaveBeenCalledWith('/tasks')
  })
}) 