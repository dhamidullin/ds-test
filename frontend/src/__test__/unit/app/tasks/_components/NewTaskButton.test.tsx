import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NewTaskButton from '@/app/tasks/_components/NewTaskButton'

describe('NewTaskButton', () => {
  it('renders new task button with correct styles and text', () => {
    render(<NewTaskButton />)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('inline-flex', 'items-center', 'gap-2', 'bg-blue-500', 'text-white', 'px-6', 'py-3', 'rounded-lg')
    expect(link).toHaveAttribute('href', '/tasks/new')

    const text = screen.getByText('New Task')
    expect(text).toBeInTheDocument()
  })

  it('contains plus icon svg', () => {
    render(<NewTaskButton />)

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveClass('w-5', 'h-5')
  })
}) 