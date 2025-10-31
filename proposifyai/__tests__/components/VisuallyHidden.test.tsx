import { render, screen } from '@/test-utils'
import { VisuallyHidden } from '@/components/VisuallyHidden'

describe('VisuallyHidden', () => {
  it('renders children with sr-only class', () => {
    render(<VisuallyHidden>Hidden content</VisuallyHidden>)

    const element = screen.getByText('Hidden content')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('sr-only')
  })

  it('renders with sr-only-focusable class when focusable is true', () => {
    render(<VisuallyHidden focusable>Focusable content</VisuallyHidden>)

    const element = screen.getByText('Focusable content')
    expect(element).toHaveClass('sr-only-focusable')
    expect(element).not.toHaveClass('sr-only')
  })

  it('renders as span by default', () => {
    render(<VisuallyHidden>Default element</VisuallyHidden>)

    const element = screen.getByText('Default element')
    expect(element.tagName).toBe('SPAN')
  })

  it('renders as custom element when specified', () => {
    render(<VisuallyHidden as="div">Custom element</VisuallyHidden>)

    const element = screen.getByText('Custom element')
    expect(element.tagName).toBe('DIV')
  })

  it('renders as heading when specified', () => {
    render(<VisuallyHidden as="h2">Hidden heading</VisuallyHidden>)

    const element = screen.getByText('Hidden heading')
    expect(element.tagName).toBe('H2')
  })

  it('applies custom className in addition to base class', () => {
    render(
      <VisuallyHidden className="custom-class">
        Custom class content
      </VisuallyHidden>
    )

    const element = screen.getByText('Custom class content')
    expect(element).toHaveClass('sr-only')
    expect(element).toHaveClass('custom-class')
  })

  it('combines focusable and custom className correctly', () => {
    render(
      <VisuallyHidden focusable className="another-class">
        Combined classes
      </VisuallyHidden>
    )

    const element = screen.getByText('Combined classes')
    expect(element).toHaveClass('sr-only-focusable')
    expect(element).toHaveClass('another-class')
  })

  it('renders nested content correctly', () => {
    render(
      <VisuallyHidden>
        <span>Nested</span> content
      </VisuallyHidden>
    )

    expect(screen.getByText('Nested')).toBeInTheDocument()
    expect(screen.getByText(/content/)).toBeInTheDocument()
  })
})
