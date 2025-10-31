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
    <div className="skip-links">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className="skip-link"
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

      <style jsx>{`
        .skip-links {
          position: relative;
          z-index: 9999;
        }

        .skip-link {
          position: absolute;
          top: -100px;
          left: 0;
          padding: 12px 16px;
          background: #3b82f6;
          color: white;
          font-weight: 600;
          text-decoration: none;
          border-radius: 0 0 8px 0;
          transition: top 0.2s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .skip-link:focus {
          top: 0;
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}

export default SkipLinks
