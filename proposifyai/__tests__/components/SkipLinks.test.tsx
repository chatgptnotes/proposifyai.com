import { render, screen } from '@/test-utils'
import SkipLinks from '@/components/SkipLinks'
import userEvent from '@testing-library/user-event'

describe('SkipLinks', () => {
  it('renders default skip links', () => {
    render(<SkipLinks />)

    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
    expect(screen.getByText('Skip to navigation')).toBeInTheDocument()
    expect(screen.getByText('Skip to footer')).toBeInTheDocument()
  })

  it('renders custom skip links', () => {
    const customLinks = [
      { id: 'skip-search', label: 'Skip to search', href: '#search' },
      { id: 'skip-content', label: 'Skip to content', href: '#content' },
    ]

    render(<SkipLinks links={customLinks} />)

    expect(screen.getByText('Skip to search')).toBeInTheDocument()
    expect(screen.getByText('Skip to content')).toBeInTheDocument()
    expect(screen.queryByText('Skip to main content')).not.toBeInTheDocument()
  })

  it('has correct href attributes', () => {
    render(<SkipLinks />)

    const mainLink = screen.getByText('Skip to main content')
    expect(mainLink).toHaveAttribute('href', '#main-content')

    const navLink = screen.getByText('Skip to navigation')
    expect(navLink).toHaveAttribute('href', '#main-nav')

    const footerLink = screen.getByText('Skip to footer')
    expect(footerLink).toHaveAttribute('href', '#footer')
  })

  it('focuses and scrolls to target element on click', async () => {
    const user = userEvent.setup()

    // Create mock target elements
    const mainContent = document.createElement('main')
    mainContent.id = 'main-content'
    document.body.appendChild(mainContent)

    const scrollIntoViewMock = jest.fn()
    mainContent.scrollIntoView = scrollIntoViewMock

    render(<SkipLinks />)

    const link = screen.getByText('Skip to main content')
    await user.click(link)

    expect(mainContent.tabIndex).toBe(-1)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })

    // Cleanup
    document.body.removeChild(mainContent)
  })

  it('is keyboard accessible', async () => {
    const user = userEvent.setup()

    render(<SkipLinks />)

    const firstLink = screen.getByText('Skip to main content')

    // Tab to the link
    await user.tab()

    expect(firstLink).toHaveFocus()
  })
})
