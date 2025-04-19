import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ClickButton from '../../../../components/ui/ClickButton'

describe('ClickButton', () => {
  it('renders delete button with correct styles', () => {
    const mockOnClick = jest.fn()
    render(<ClickButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('p-2', 'text-gray-500', 'rounded-lg')
  })

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn()
    render(<ClickButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('contains svg icon', () => {
    const mockOnClick = jest.fn()
    render(<ClickButton onClick={mockOnClick} />)

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveClass('w-5', 'h-5')
  })

  it('passes additional properties to button element', () => {
    const mockOnClick = jest.fn()
    render(
      <ClickButton 
        onClick={mockOnClick} 
        type="submit"
        disabled
        className="custom-class"
        data-testid="test-button"
      />
    )

    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('custom-class')
  })
}) 