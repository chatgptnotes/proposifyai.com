'use client';

import packageJson from '../package.json';

export default function VersionFooter() {
  const version = `v${packageJson.version}`;
  const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 text-center">
        <p className="text-xs text-gray-400 font-mono">
          ProposifyAI {version} • Released {date}
        </p>
      </div>
    </div>
  );
}
