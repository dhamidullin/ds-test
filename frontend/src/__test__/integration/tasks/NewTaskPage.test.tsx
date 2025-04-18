import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'
import { tasksApi } from '@/lib/api'
import NewTaskPage from '@/app/tasks/new/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the API
jest.mock('@/lib/api', () => ({
  tasksApi: {
    create: jest.fn(),
  },
}))

describe('NewTaskPage', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders the new task form', () => {
    render(<NewTaskPage />)
    
    expect(screen.getByText('New Task')).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByText('Create Task')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('submits the form and navigates on success', async () => {
    const mockTask = { id: 1, title: 'Test Task', description: 'Test Description' }
    ;(tasksApi.create as jest.Mock).mockResolvedValue(mockTask)

    render(<NewTaskPage />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Task' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } })

    // Submit the form
    fireEvent.click(screen.getByText('Create Task'))

    // Wait for the API call and navigation
    await waitFor(() => {
      expect(tasksApi.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
      })
      expect(mockRouter.push).toHaveBeenCalledWith('/tasks/1/edit')
      expect(mockRouter.refresh).toHaveBeenCalled()
    })
  })

  it('shows error alert on API failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(tasksApi.create as jest.Mock).mockRejectedValue(new Error('API Error'))

    render(<NewTaskPage />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Task' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } })

    // Submit the form
    fireEvent.click(screen.getByText('Create Task'))

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error creating task:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('navigates back to tasks list when cancel is clicked', () => {
    render(<NewTaskPage />)
    
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(mockRouter.push).toHaveBeenCalledWith('/tasks')
  })
}) 