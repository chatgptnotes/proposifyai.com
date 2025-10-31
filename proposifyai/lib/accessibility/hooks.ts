/**
 * Accessibility React Hooks
 * Custom hooks for accessible UI patterns
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createFocusTrap, KeyboardShortcut, KeyboardShortcutManager } from './keyboard-nav'
import { generateAriaId, announceToScreenReader } from './aria-helpers'

/**
 * Hook to manage focus trap for modals/dialogs
 */
export function useFocusTrap(active: boolean = false) {
  const containerRef = useRef<HTMLElement>(null)
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (active) {
      trapRef.current = createFocusTrap(containerRef.current)
      trapRef.current.activate()
    }

    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate()
        trapRef.current = null
      }
    }
  }, [active])

  return containerRef
}

/**
 * Hook to generate unique ARIA IDs
 */
export function useAriaId(prefix: string = 'aria'): string {
  const [id] = useState(() => generateAriaId(prefix))
  return id
}

/**
 * Hook to announce messages to screen readers
 */
export function useScreenReader() {
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      announceToScreenReader(message, priority)
    },
    []
  )

  return announce
}

/**
 * Hook to manage keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const managerRef = useRef<KeyboardShortcutManager | null>(null)

  useEffect(() => {
    if (!enabled) return

    managerRef.current = new KeyboardShortcutManager()

    shortcuts.forEach((shortcut) => {
      managerRef.current?.register(shortcut)
    })

    managerRef.current.activate()

    return () => {
      managerRef.current?.deactivate()
      managerRef.current = null
    }
  }, [shortcuts, enabled])

  return managerRef.current
}

/**
 * Hook to manage focus on mount
 */
export function useAutoFocus(enabled: boolean = true) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (enabled && ref.current) {
      // Small delay to ensure element is rendered
      const timeoutId = setTimeout(() => {
        ref.current?.focus()
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [enabled])

  return ref
}

/**
 * Hook to restore focus when component unmounts
 */
export function useRestoreFocus() {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement

    return () => {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [])
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook to manage disclosure (expandable/collapsible) state
 */
export function useDisclosure(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState)
  const buttonId = useAriaId('disclosure-button')
  const panelId = useAriaId('disclosure-panel')

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const buttonProps = {
    id: buttonId,
    'aria-expanded': isOpen,
    'aria-controls': panelId,
    onClick: toggle,
  }

  const panelProps = {
    id: panelId,
    'aria-labelledby': buttonId,
    hidden: !isOpen,
  }

  return {
    isOpen,
    toggle,
    open,
    close,
    buttonProps,
    panelProps,
  }
}

/**
 * Hook to manage tab list navigation
 */
export function useTabs(defaultTab: number = 0) {
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const tabListId = useAriaId('tablist')

  const getTabProps = (index: number, label: string) => {
    const tabId = `${tabListId}-tab-${index}`
    const panelId = `${tabListId}-panel-${index}`

    return {
      role: 'tab',
      id: tabId,
      'aria-controls': panelId,
      'aria-selected': selectedTab === index,
      'aria-label': label,
      tabIndex: selectedTab === index ? 0 : -1,
      onClick: () => setSelectedTab(index),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          setSelectedTab((prev) => (prev + 1) % getTotalTabs())
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setSelectedTab((prev) => (prev - 1 + getTotalTabs()) % getTotalTabs())
        } else if (e.key === 'Home') {
          e.preventDefault()
          setSelectedTab(0)
        } else if (e.key === 'End') {
          e.preventDefault()
          setSelectedTab(getTotalTabs() - 1)
        }
      },
    }
  }

  const getTabPanelProps = (index: number, label: string) => {
    const tabId = `${tabListId}-tab-${index}`
    const panelId = `${tabListId}-panel-${index}`

    return {
      role: 'tabpanel',
      id: panelId,
      'aria-labelledby': tabId,
      'aria-label': label,
      hidden: selectedTab !== index,
      tabIndex: 0,
    }
  }

  const getTabListProps = () => ({
    role: 'tablist',
    id: tabListId,
    'aria-label': 'Tab navigation',
  })

  // Helper to get total tabs (should be provided by component)
  let totalTabs = 0
  const getTotalTabs = () => totalTabs
  const setTotalTabs = (count: number) => {
    totalTabs = count
  }

  return {
    selectedTab,
    setSelectedTab,
    getTabProps,
    getTabPanelProps,
    getTabListProps,
    setTotalTabs,
  }
}

/**
 * Hook to manage modal/dialog accessibility
 */
export function useModal(isOpen: boolean) {
  const modalRef = useFocusTrap(isOpen)
  const modalId = useAriaId('modal')
  const titleId = useAriaId('modal-title')
  const descriptionId = useAriaId('modal-description')

  useRestoreFocus()

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  const modalProps = {
    ref: modalRef,
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
    id: modalId,
  }

  const titleProps = {
    id: titleId,
  }

  const descriptionProps = {
    id: descriptionId,
  }

  return {
    modalProps,
    titleProps,
    descriptionProps,
  }
}

/**
 * Hook to manage live region announcements
 */
export function useLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announce = useScreenReader()

  useEffect(() => {
    if (message) {
      announce(message, priority)
    }
  }, [message, priority, announce])
}

/**
 * Hook to detect if an element is visible in viewport
 */
export function useInViewport(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, options)

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref, isInView }
}
