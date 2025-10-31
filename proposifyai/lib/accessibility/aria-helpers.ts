/**
 * ARIA Helper Functions
 * Utilities for accessible UI components
 */

export interface AriaLabelProps {
  'aria-label': string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0
export function generateAriaId(prefix: string = 'aria'): string {
  idCounter++
  return `${prefix}-${idCounter}-${Date.now()}`
}

/**
 * Create ARIA label props for buttons
 */
export function getButtonAriaProps(
  label: string,
  options?: {
    describedBy?: string
    expanded?: boolean
    pressed?: boolean
    disabled?: boolean
  }
): Record<string, string | boolean | undefined> {
  const props: Record<string, string | boolean | undefined> = {
    'aria-label': label,
  }

  if (options?.describedBy) {
    props['aria-describedby'] = options.describedBy
  }

  if (options?.expanded !== undefined) {
    props['aria-expanded'] = options.expanded
  }

  if (options?.pressed !== undefined) {
    props['aria-pressed'] = options.pressed
  }

  if (options?.disabled) {
    props['aria-disabled'] = true
  }

  return props
}

/**
 * Create ARIA props for links
 */
export function getLinkAriaProps(
  label: string,
  options?: {
    current?: boolean
    external?: boolean
  }
): Record<string, string | boolean | undefined> {
  const props: Record<string, string | boolean | undefined> = {
    'aria-label': label,
  }

  if (options?.current) {
    props['aria-current'] = 'page'
  }

  if (options?.external) {
    props['aria-label'] = `${label} (opens in new tab)`
  }

  return props
}

/**
 * Create ARIA props for form inputs
 */
export function getInputAriaProps(
  label: string,
  options?: {
    required?: boolean
    invalid?: boolean
    describedBy?: string
    errorId?: string
  }
): Record<string, string | boolean | undefined> {
  const props: Record<string, string | boolean | undefined> = {
    'aria-label': label,
  }

  if (options?.required) {
    props['aria-required'] = true
  }

  if (options?.invalid) {
    props['aria-invalid'] = true
    if (options.errorId) {
      props['aria-describedby'] = options.errorId
    }
  } else if (options?.describedBy) {
    props['aria-describedby'] = options.describedBy
  }

  return props
}

/**
 * Create ARIA props for dialogs/modals
 */
export function getDialogAriaProps(
  label: string,
  options?: {
    describedBy?: string
    modal?: boolean
  }
): Record<string, string | boolean | undefined> {
  return {
    role: 'dialog',
    'aria-label': label,
    'aria-describedby': options?.describedBy,
    'aria-modal': options?.modal !== false,
  }
}

/**
 * Create ARIA props for alerts
 */
export function getAlertAriaProps(
  type: 'error' | 'warning' | 'info' | 'success' = 'info',
  live: 'off' | 'polite' | 'assertive' = 'polite'
): Record<string, string> {
  return {
    role: type === 'error' || type === 'warning' ? 'alert' : 'status',
    'aria-live': live,
    'aria-atomic': 'true',
  }
}

/**
 * Create ARIA props for tabs
 */
export function getTabAriaProps(
  label: string,
  options: {
    selected: boolean
    controls: string
    id: string
  }
): Record<string, string | boolean | number> {
  return {
    role: 'tab',
    'aria-label': label,
    'aria-selected': options.selected,
    'aria-controls': options.controls,
    id: options.id,
    tabIndex: options.selected ? 0 : -1,
  }
}

/**
 * Create ARIA props for tab panels
 */
export function getTabPanelAriaProps(
  label: string,
  options: {
    hidden: boolean
    labelledBy: string
    id: string
  }
): Record<string, string | boolean | number> {
  return {
    role: 'tabpanel',
    'aria-label': label,
    'aria-labelledby': options.labelledBy,
    'aria-hidden': options.hidden,
    id: options.id,
    tabIndex: 0,
  }
}

/**
 * Create ARIA props for menus
 */
export function getMenuAriaProps(
  label: string,
  options?: {
    expanded?: boolean
    orientation?: 'horizontal' | 'vertical'
  }
): Record<string, string | boolean | undefined> {
  return {
    role: 'menu',
    'aria-label': label,
    'aria-expanded': options?.expanded,
    'aria-orientation': options?.orientation || 'vertical',
  }
}

/**
 * Create ARIA props for menu items
 */
export function getMenuItemAriaProps(
  label: string,
  options?: {
    disabled?: boolean
    current?: boolean
  }
): Record<string, string | boolean | number | undefined> {
  const props: Record<string, string | boolean | number | undefined> = {
    role: 'menuitem',
    'aria-label': label,
    tabIndex: options?.disabled ? -1 : 0,
  }

  if (options?.disabled) {
    props['aria-disabled'] = true
  }

  if (options?.current) {
    props['aria-current'] = 'page'
  }

  return props
}

/**
 * Create ARIA props for tooltips
 */
export function getTooltipAriaProps(
  id: string,
  visible: boolean
): Record<string, string | undefined> {
  return {
    role: 'tooltip',
    id,
    'aria-hidden': visible ? undefined : 'true',
  }
}

/**
 * Create ARIA props for progress indicators
 */
export function getProgressAriaProps(
  label: string,
  options?: {
    value?: number
    min?: number
    max?: number
    indeterminate?: boolean
  }
): Record<string, string | number | undefined> {
  const props: Record<string, string | number | undefined> = {
    role: 'progressbar',
    'aria-label': label,
  }

  if (!options?.indeterminate && options?.value !== undefined) {
    props['aria-valuenow'] = options.value
    props['aria-valuemin'] = options.min || 0
    props['aria-valuemax'] = options.max || 100
  }

  return props
}

/**
 * Create ARIA props for loading states
 */
export function getLoadingAriaProps(
  label: string = 'Loading'
): Record<string, string | boolean> {
  return {
    role: 'status',
    'aria-label': label,
    'aria-live': 'polite',
    'aria-busy': 'true',
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}
