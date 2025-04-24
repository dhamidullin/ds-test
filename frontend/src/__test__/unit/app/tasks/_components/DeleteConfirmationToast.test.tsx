import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import DeleteConfirmationToast from '@/app/tasks/_components/DeleteConfirmationToast'

describe('DeleteConfirmationToast', () => {
  it('shows confirmation toast with correct content', () => {
    const mockOnConfirm = jest.fn()
    const mockOnCancel = jest.fn()
    
    render(
      <DeleteConfirmationToast 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    )

    // Check toast content
    expect(screen.getByText('Delete Task')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this task?')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onConfirm when delete button is clicked', () => {
    const mockOnConfirm = jest.fn()
    const mockOnCancel = jest.fn()
    
    render(
      <DeleteConfirmationToast 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    )

    // Click delete button
    fireEvent.click(screen.getByText('Delete'))

    // Verify onConfirm was called
    expect(mockOnConfirm).toHaveBeenCalled()
    // Verify onCancel was not called
    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', () => {
    const mockOnConfirm = jest.fn()
    const mockOnCancel = jest.fn()
    
    render(
      <DeleteConfirmationToast 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    )

    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'))

    // Verify onCancel was called
    expect(mockOnCancel).toHaveBeenCalled()
    // Verify onConfirm was not called
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })
}) 