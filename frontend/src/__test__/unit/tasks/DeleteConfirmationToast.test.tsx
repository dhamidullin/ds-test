import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { showDeleteConfirmationToast } from '../../../app/tasks/DeleteConfirmationToast'
import { toast } from 'sonner'

// Mock the sonner toast
jest.mock('sonner', () => ({
  toast: {
    custom: jest.fn(),
    dismiss: jest.fn(),
    promise: jest.fn(),
  },
}))

describe('DeleteConfirmationToast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows confirmation toast with correct content', () => {
    const mockOnConfirm = jest.fn()
    showDeleteConfirmationToast({ onConfirm: mockOnConfirm })

    // Get the custom toast function call
    const customToastCall = (toast.custom as jest.Mock).mock.calls[0][0]
    const { getByText } = render(customToastCall({}))

    // Check toast content
    expect(getByText('Delete Task')).toBeInTheDocument()
    expect(getByText('Are you sure you want to delete this task?')).toBeInTheDocument()
    expect(getByText('Cancel')).toBeInTheDocument()
    expect(getByText('Delete')).toBeInTheDocument()
  })

  it('calls onConfirm when delete button is clicked', () => {
    const mockOnConfirm = jest.fn()
    showDeleteConfirmationToast({ onConfirm: mockOnConfirm })

    const customToastCall = (toast.custom as jest.Mock).mock.calls[0][0]
    const { getByText } = render(customToastCall({}))

    // Click delete button
    fireEvent.click(getByText('Delete'))

    // Verify toast.dismiss was called
    expect(toast.dismiss).toHaveBeenCalled()
    // Verify toast.promise was called with onConfirm
    expect(toast.promise).toHaveBeenCalledWith(mockOnConfirm(), {
      loading: 'Deleting task...',
      success: 'Task deleted successfully',
      error: 'Failed to delete task',
    })
  })

  it('dismisses toast when cancel button is clicked', () => {
    const mockOnConfirm = jest.fn()
    showDeleteConfirmationToast({ onConfirm: mockOnConfirm })

    const customToastCall = (toast.custom as jest.Mock).mock.calls[0][0]
    const { getByText } = render(customToastCall({}))

    // Click cancel button
    fireEvent.click(getByText('Cancel'))

    // Verify toast.dismiss was called
    expect(toast.dismiss).toHaveBeenCalled()
    // Verify onConfirm was not called
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })
}) 