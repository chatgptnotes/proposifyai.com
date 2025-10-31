/**
 * Visually Hidden Component
 * Hides content visually but keeps it accessible to screen readers
 */

import { ReactNode } from 'react'

interface VisuallyHiddenProps {
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
  focusable?: boolean
  className?: string
}

export function VisuallyHidden({
  children,
  as: Component = 'span',
  focusable = false,
  className = '',
}: VisuallyHiddenProps) {
  const baseClass = focusable ? 'sr-only-focusable' : 'sr-only'

  return <Component className={`${baseClass} ${className}`.trim()}>{children}</Component>
}

export default VisuallyHidden

// CSS to add to globals.css:
/*
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
*/
