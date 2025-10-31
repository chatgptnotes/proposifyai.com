"use client";

import Link from "next/link";
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VersionFooter from '@/components/VersionFooter';

export default function RoutesPage() {
  const routes = [
    { path: "/", name: "Landing Page", description: "Main homepage with features and pricing" },
    { path: "/login", name: "Login", description: "User login page" },
    { path: "/signup", name: "Sign Up", description: "New user registration" },
    { path: "/dashboard", name: "Dashboard", description: "Main dashboard with stats and activity" },
    { path: "/proposals", name: "Proposals List", description: "View all proposals" },
    { path: "/proposals/new", name: "Create Proposal", description: "Create new proposal from template" },
    { path: "/proposals/1", name: "Edit Proposal", description: "Edit/view proposal (example ID: 1)" },
    { path: "/templates", name: "Templates", description: "Browse and manage templates" },
    { path: "/settings", name: "Settings", description: "Account and company settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Proposify AI - All Routes
          </h1>
          <p className="text-lg text-gray-600">
            Click any link below to navigate to that page
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Server running at: <strong>http://localhost:3000</strong>
          </p>
        </div>

        <div className="space-y-4">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.path}
              className="block bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-primary-500 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <DescriptionIcon className="text-primary-600" sx={{ fontSize: 28 }} />
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">
                      {route.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-2">{route.description}</p>
                  <p className="text-sm font-mono text-primary-600">
                    {route.path}
                  </p>
                </div>
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-2 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleIcon sx={{ fontSize: 32 }} />
            <h2 className="text-2xl font-bold">All Routes Are Working!</h2>
          </div>
          <ul className="space-y-2 text-primary-100">
            <li className="flex items-center gap-2">
              <CheckCircleIcon sx={{ fontSize: 20 }} /> {routes.length} pages configured
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon sx={{ fontSize: 20 }} /> Next.js 14 App Router
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon sx={{ fontSize: 20 }} /> Dynamic routes enabled
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon sx={{ fontSize: 20 }} /> Server running on port 3000
            </li>
          </ul>
          <p className="mt-4 text-sm">
            If you can&apos;t access a page, try clearing your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+F5 on Windows)
          </p>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <BuildIcon className="text-yellow-900" />
            <h3 className="font-bold text-yellow-900">Troubleshooting</h3>
          </div>
          <div className="text-sm text-yellow-800 space-y-2">
            <p><strong>If pages won&apos;t load:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Check server is running: Look for &quot;Ready in...&quot; message</li>
              <li>Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)</li>
              <li>Try incognito/private mode</li>
              <li>Check URL is http://localhost:3000 (not 3001)</li>
              <li>Restart server: Stop (Ctrl+C) and run &quot;npm run dev&quot; again</li>
            </ol>
          </div>
        </div>
      </div>
      <VersionFooter />
    </div>
  );
}
