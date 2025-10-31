'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname || pathname === '/') return [];

    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard' }
    ];

    let currentPath = '';
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;

      // Format the label
      let label = paths[i]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Special cases for known routes
      if (paths[i] === 'proposals' && paths[i + 1] === 'new') {
        label = 'Proposals';
      } else if (paths[i - 1] === 'proposals' && paths[i] === 'new') {
        label = 'New Proposal';
      } else if (paths[i - 1] === 'proposals' && !isNaN(Number(paths[i]))) {
        label = `Proposal #${paths[i]}`;
      }

      breadcrumbs.push({
        label,
        href: currentPath
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 py-3">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-primary-600 transition-colors"
        title="Home"
      >
        <HomeIcon sx={{ fontSize: 18 }} />
      </Link>

      {breadcrumbs.slice(1).map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 2;

        return (
          <div key={crumb.href} className="flex items-center space-x-2">
            <ChevronRightIcon sx={{ fontSize: 16 }} className="text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-primary-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
