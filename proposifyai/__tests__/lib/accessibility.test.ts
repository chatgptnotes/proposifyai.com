import {
  generateAriaId,
  getButtonAriaProps,
  getDialogAriaProps,
  getTabAriaProps,
  announceToScreenReader,
} from '@/lib/accessibility/aria-helpers'

import { handleArrowNavigation } from '@/lib/accessibility/keyboard-nav'

describe('Accessibility Utilities', () => {
  describe('generateAriaId', () => {
    it('generates unique IDs with prefix', () => {
      const id1 = generateAriaId('test')
      const id2 = generateAriaId('test')

      expect(id1).toMatch(/^test-\d+-\d+$/)
      expect(id2).toMatch(/^test-\d+-\d+$/)
      expect(id1).not.toBe(id2)
    })

    it('uses default prefix when none provided', () => {
      const id = generateAriaId()

      expect(id).toMatch(/^aria-\d+-\d+$/)
    })
  })

  describe('getButtonAriaProps', () => {
    it('generates basic button props', () => {
      const props = getButtonAriaProps('Save changes')

      expect(props['aria-label']).toBe('Save changes')
    })

    it('includes disabled state', () => {
      const props = getButtonAriaProps('Submit', { disabled: true })

      expect(props['aria-disabled']).toBe(true)
    })

    it('includes expanded state', () => {
      const props = getButtonAriaProps('Menu', { expanded: true })

      expect(props['aria-expanded']).toBe(true)
    })

    it('includes pressed state', () => {
      const props = getButtonAriaProps('Toggle', { pressed: true })

      expect(props['aria-pressed']).toBe(true)
    })

    it('includes describedBy reference', () => {
      const props = getButtonAriaProps('Help', { describedBy: 'help-text' })

      expect(props['aria-describedby']).toBe('help-text')
    })
  })

  describe('getDialogAriaProps', () => {
    it('generates dialog props with label and description', () => {
      const props = getDialogAriaProps('Confirm Action', {
        describedBy: 'desc-id',
      })

      expect(props.role).toBe('dialog')
      expect(props['aria-modal']).toBe(true)
      expect(props['aria-label']).toBe('Confirm Action')
      expect(props['aria-describedby']).toBe('desc-id')
    })

    it('works with only label', () => {
      const props = getDialogAriaProps('Simple Dialog')

      expect(props.role).toBe('dialog')
      expect(props['aria-label']).toBe('Simple Dialog')
      expect(props['aria-describedby']).toBeUndefined()
    })

    it('sets modal to true by default', () => {
      const props = getDialogAriaProps('Test')

      expect(props['aria-modal']).toBe(true)
    })

    it('can set modal to false', () => {
      const props = getDialogAriaProps('Test', { modal: false })

      expect(props['aria-modal']).toBe(false)
    })
  })

  describe('getTabAriaProps', () => {
    it('generates tab props', () => {
      const props = getTabAriaProps('First Tab', {
        selected: true,
        controls: 'panel-1',
        id: 'tab-1',
      })

      expect(props.role).toBe('tab')
      expect(props['aria-label']).toBe('First Tab')
      expect(props['aria-selected']).toBe(true)
      expect(props['aria-controls']).toBe('panel-1')
      expect(props.id).toBe('tab-1')
      expect(props.tabIndex).toBe(0)
    })

    it('sets tabIndex -1 for unselected tabs', () => {
      const props = getTabAriaProps('Second Tab', {
        selected: false,
        controls: 'panel-2',
        id: 'tab-2',
      })

      expect(props['aria-selected']).toBe(false)
      expect(props.tabIndex).toBe(-1)
    })
  })

  describe('announceToScreenReader', () => {
    beforeEach(() => {
      // Clear the document body
      document.body.innerHTML = ''
    })

    it('creates announcement element with polite priority', () => {
      announceToScreenReader('Test announcement', 'polite')

      const announcement = document.querySelector('[role="status"]')
      expect(announcement).toBeInTheDocument()
      expect(announcement).toHaveAttribute('aria-live', 'polite')
      expect(announcement).toHaveTextContent('Test announcement')
    })

    it('creates announcement element with assertive priority', () => {
      announceToScreenReader('Error occurred', 'assertive')

      const announcement = document.querySelector('[role="status"]')
      expect(announcement).toBeInTheDocument()
      expect(announcement).toHaveAttribute('aria-live', 'assertive')
      expect(announcement).toHaveTextContent('Error occurred')
    })

    it('applies sr-only class', () => {
      announceToScreenReader('Hidden announcement')

      const announcement = document.querySelector('[role="status"]')
      expect(announcement).toHaveClass('sr-only')
    })
  })

  describe('handleArrowNavigation', () => {
    it('navigates to next item on ArrowDown', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })

      handleArrowNavigation(event, {
        currentIndex: 0,
        itemCount: 3,
        onNavigate: mockNavigate,
        orientation: 'vertical',
      })

      expect(mockNavigate).toHaveBeenCalledWith(1)
    })

    it('navigates to previous item on ArrowUp', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })

      handleArrowNavigation(event, {
        currentIndex: 2,
        itemCount: 3,
        onNavigate: mockNavigate,
        orientation: 'vertical',
      })

      expect(mockNavigate).toHaveBeenCalledWith(1)
    })

    it('loops to first item when at end', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })

      handleArrowNavigation(event, {
        currentIndex: 2,
        itemCount: 3,
        onNavigate: mockNavigate,
        orientation: 'vertical',
        loop: true,
      })

      expect(mockNavigate).toHaveBeenCalledWith(0)
    })

    it('loops to last item when at start', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })

      handleArrowNavigation(event, {
        currentIndex: 0,
        itemCount: 3,
        onNavigate: mockNavigate,
        orientation: 'vertical',
        loop: true,
      })

      expect(mockNavigate).toHaveBeenCalledWith(2)
    })

    it('does not loop when disabled', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })

      handleArrowNavigation(event, {
        currentIndex: 2,
        itemCount: 3,
        onNavigate: mockNavigate,
        orientation: 'vertical',
        loop: false,
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('navigates with ArrowRight in horizontal mode', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })

      handleArrowNavigation(event, {
        currentIndex: 0,
        itemCount: 3,
        onNavigate: mockNavigate,
        orientation: 'horizontal',
      })

      expect(mockNavigate).toHaveBeenCalledWith(1)
    })

    it('navigates with ArrowLeft in horizontal mode', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })

      handleArrowNavigation(event, {
        currentIndex: 1,
        itemCount: 3,
        onNavigate: mockNavigate,
        orientation: 'horizontal',
      })

      expect(mockNavigate).toHaveBeenCalledWith(0)
    })

    it('navigates to first item on Home', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'Home' })

      handleArrowNavigation(event, {
        currentIndex: 2,
        itemCount: 3,
        onNavigate: mockNavigate,
      })

      expect(mockNavigate).toHaveBeenCalledWith(0)
    })

    it('navigates to last item on End', () => {
      const mockNavigate = jest.fn()
      const event = new KeyboardEvent('keydown', { key: 'End' })

      handleArrowNavigation(event, {
        currentIndex: 0,
        itemCount: 3,
        onNavigate: mockNavigate,
      })

      expect(mockNavigate).toHaveBeenCalledWith(2)
    })
  })
})
