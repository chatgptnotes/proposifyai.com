/**
 * Keyboard Navigation Utilities
 * Helper functions for accessible keyboard interactions
 */

export type KeyboardKey =
  | 'Enter'
  | 'Space'
  | 'Escape'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Tab'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'

/**
 * Check if a specific key was pressed
 */
export function isKey(event: KeyboardEvent, key: KeyboardKey | KeyboardKey[]): boolean {
  const keys = Array.isArray(key) ? key : [key]
  return keys.includes(event.key as KeyboardKey)
}

/**
 * Handle Enter or Space key press (for button-like elements)
 */
export function handleActivationKey(
  event: KeyboardEvent,
  callback: () => void,
  preventDefault: boolean = true
): void {
  if (isKey(event, ['Enter', 'Space'])) {
    if (preventDefault) {
      event.preventDefault()
    }
    callback()
  }
}

/**
 * Handle arrow key navigation in a list
 */
export function handleArrowNavigation(
  event: KeyboardEvent,
  options: {
    currentIndex: number
    itemCount: number
    onNavigate: (newIndex: number) => void
    orientation?: 'vertical' | 'horizontal'
    loop?: boolean
  }
): void {
  const { currentIndex, itemCount, onNavigate, orientation = 'vertical', loop = true } = options

  const isVertical = orientation === 'vertical'
  const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
  const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

  if (isKey(event, nextKey)) {
    event.preventDefault()
    const nextIndex = currentIndex + 1
    if (nextIndex < itemCount) {
      onNavigate(nextIndex)
    } else if (loop) {
      onNavigate(0)
    }
  } else if (isKey(event, prevKey)) {
    event.preventDefault()
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      onNavigate(prevIndex)
    } else if (loop) {
      onNavigate(itemCount - 1)
    }
  } else if (isKey(event, 'Home')) {
    event.preventDefault()
    onNavigate(0)
  } else if (isKey(event, 'End')) {
    event.preventDefault()
    onNavigate(itemCount - 1)
  }
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function createFocusTrap(container: HTMLElement): {
  activate: () => void
  deactivate: () => void
} {
  let previousFocus: HTMLElement | null = null

  const getFocusableElements = (): HTMLElement[] => {
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    return Array.from(container.querySelectorAll(selector))
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isKey(event, 'Tab')) return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }

  const activate = () => {
    previousFocus = document.activeElement as HTMLElement
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
    document.addEventListener('keydown', handleKeyDown)
  }

  const deactivate = () => {
    document.removeEventListener('keydown', handleKeyDown)
    if (previousFocus) {
      previousFocus.focus()
    }
  }

  return { activate, deactivate }
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return Array.from(container.querySelectorAll(selector))
}

/**
 * Focus the first focusable element in a container
 */
export function focusFirst(container: HTMLElement): boolean {
  const elements = getFocusableElements(container)
  if (elements.length > 0) {
    elements[0].focus()
    return true
  }
  return false
}

/**
 * Focus the last focusable element in a container
 */
export function focusLast(container: HTMLElement): boolean {
  const elements = getFocusableElements(container)
  if (elements.length > 0) {
    elements[elements.length - 1].focus()
    return true
  }
  return false
}

/**
 * Check if element is currently focused
 */
export function isFocused(element: HTMLElement): boolean {
  return document.activeElement === element
}

/**
 * Save current focus and return a function to restore it
 */
export function saveFocus(): () => void {
  const previousFocus = document.activeElement as HTMLElement
  return () => {
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus()
    }
  }
}

/**
 * Handle keyboard shortcuts
 */
export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  callback: (event: KeyboardEvent) => void
  description: string
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map()

  register(shortcut: KeyboardShortcut): void {
    const id = this.getShortcutId(shortcut)
    this.shortcuts.set(id, shortcut)
  }

  unregister(shortcut: Partial<KeyboardShortcut>): void {
    const id = this.getShortcutId(shortcut as KeyboardShortcut)
    this.shortcuts.delete(id)
  }

  private getShortcutId(shortcut: KeyboardShortcut): string {
    const modifiers = [
      shortcut.ctrl && 'ctrl',
      shortcut.shift && 'shift',
      shortcut.alt && 'alt',
      shortcut.meta && 'meta',
    ]
      .filter(Boolean)
      .join('+')

    return modifiers ? `${modifiers}+${shortcut.key}` : shortcut.key
  }

  handleKeyDown = (event: KeyboardEvent): void => {
    const shortcuts = Array.from(this.shortcuts.values())
    for (const shortcut of shortcuts) {
      const matches =
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        event.ctrlKey === Boolean(shortcut.ctrl) &&
        event.shiftKey === Boolean(shortcut.shift) &&
        event.altKey === Boolean(shortcut.alt) &&
        event.metaKey === Boolean(shortcut.meta)

      if (matches) {
        event.preventDefault()
        shortcut.callback(event)
        break
      }
    }
  }

  activate(): void {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  deactivate(): void {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values())
  }
}

/**
 * Debounce keyboard input
 */
export function debounceKeyboard<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number = 300
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }
}
