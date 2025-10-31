/**
 * Skip Links Component
 * Allows keyboard users to skip to main content
 */

'use client'

import Link from 'next/link'

interface SkipLink {
  id: string
  label: string
  href: string
}

const DEFAULT_SKIP_LINKS: SkipLink[] = [
  {
    id: 'skip-to-main',
    label: 'Skip to main content',
    href: '#main-content',
  },
  {
    id: 'skip-to-nav',
    label: 'Skip to navigation',
    href: '#main-nav',
  },
  {
    id: 'skip-to-footer',
    label: 'Skip to footer',
    href: '#footer',
  },
]

interface SkipLinksProps {
  links?: SkipLink[]
}

export function SkipLinks({ links = DEFAULT_SKIP_LINKS }: SkipLinksProps) {
  return (
    <div className="sr-only focus-within:not-sr-only">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className="absolute left-0 top-0 z-[9999] -translate-y-full bg-primary-600 px-4 py-3 text-white font-semibold rounded-br-lg shadow-lg transition-transform focus:translate-y-0 focus:outline focus:outline-4 focus:outline-yellow-400 focus:outline-offset-2"
          onClick={(e) => {
            e.preventDefault()
            const target = document.querySelector(link.href)
            if (target instanceof HTMLElement) {
              target.tabIndex = -1
              target.focus()
              target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

export default SkipLinks
