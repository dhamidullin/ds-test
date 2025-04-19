import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LinkButton from '../../../../components/ui/LinkButton'

describe('LinkButton', () => {
  it('renders edit button with correct styles', () => {
    render(<LinkButton href="/edit" />)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('p-2', 'text-gray-500', 'rounded-lg')
    expect(link).toHaveAttribute('href', '/edit')
  })

  it('contains svg icon', () => {
    render(<LinkButton href="/edit" />)

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveClass('w-5', 'h-5')
  })

  it('passes additional properties to anchor element', () => {
    render(
      <LinkButton 
        href="/edit" 
        target="_blank"
        rel="noopener noreferrer"
        className="custom-class"
        data-testid="test-link"
      />
    )

    const link = screen.getByTestId('test-link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveClass('custom-class')
  })
}) 