import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EditButton } from '../../../components/ui/EditButton'

describe('EditButton', () => {
  it('renders edit button with correct styles', () => {
    render(<EditButton href="/edit" />)
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('p-2', 'text-gray-500', 'rounded-lg')
    expect(link).toHaveAttribute('href', '/edit')
  })

  it('contains svg icon', () => {
    render(<EditButton href="/edit" />)
    
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveClass('w-5', 'h-5')
  })
}) 