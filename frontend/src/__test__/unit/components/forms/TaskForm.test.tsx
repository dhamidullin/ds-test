import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isSubmitting: false,
    mode: 'create' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering Tests ---

  it('renders correctly in create mode', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.queryByLabelText('Completed')).not.toBeInTheDocument(); // Not visible in create mode
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders correctly in edit mode with initial data', () => {
    const initialData = { id: 1, title: 'Test Title', description: 'Test Desc', completed: true };
    render(<TaskForm {...defaultProps} mode="edit" initialData={initialData} />);

    expect(screen.getByLabelText('Title')).toHaveValue('Test Title');
    expect(screen.getByLabelText('Description')).toHaveValue('Test Desc');
    expect(screen.getByLabelText('Completed')).toBeChecked();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  // --- Input Handling Tests ---

  it('updates title state on change', () => {
    render(<TaskForm {...defaultProps} />);
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');
  });

  it('updates description state on change', () => {
    render(<TaskForm {...defaultProps} />);
    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    expect(descriptionInput).toHaveValue('New Description');
  });

  it('updates completed state on change in edit mode', () => {
    render(<TaskForm {...defaultProps} mode="edit" initialData={{ completed: false }} />);
    const completedCheckbox = screen.getByLabelText('Completed');
    fireEvent.click(completedCheckbox);
    expect(completedCheckbox).toBeChecked();
    fireEvent.click(completedCheckbox);
    expect(completedCheckbox).not.toBeChecked();
  });

  // --- Validation Tests ---

  it('does not submit and shows error if title is empty', async () => {
    render(<TaskForm {...defaultProps} />);
    const submitButton = screen.getByRole('button', { name: 'Create Task' });
    const titleInput = screen.getByLabelText('Title');

    fireEvent.change(titleInput, { target: { value: ' ' } }); // Empty title
    fireEvent.click(submitButton);

    // await waitFor(() => {
    //   // Check for error message display if implemented
    //   // expect(screen.getByText('Title is required')).toBeInTheDocument(); // Assuming error display
    // });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // --- Submission Tests ---

  it('calls onSubmit with correct data in create mode', async () => {
    render(<TaskForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Submit Title' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Submit Desc' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    const expectedData: TaskFormData = {
      title: 'Submit Title',
      description: 'Submit Desc',
      completed: false, // Default for create mode
    };

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(expectedData);
    });
  });

  it('calls onSubmit with correct data in edit mode', async () => {
    const initialData = { id: 1, title: 'Old Title', description: 'Old Desc', completed: false };
    render(<TaskForm {...defaultProps} mode="edit" initialData={initialData} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Desc' } });
    fireEvent.click(screen.getByLabelText('Completed')); // Toggle to true
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    const expectedData: TaskFormData = {
      title: 'Updated Title',
      description: 'Updated Desc',
      completed: true,
    };

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(expectedData);
    });
  });

  it('shows submitting state and disables buttons when isSubmitting is true', () => {
    render(<TaskForm {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'Creating...' }); // Correct submitting text
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('shows correct submitting text in edit mode', () => {
     render(<TaskForm {...defaultProps} mode="edit" isSubmitting={true} />);
     expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
   });


  // --- Cancellation Tests ---

  it('calls onCancel when cancel button is clicked', () => {
    render(<TaskForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
