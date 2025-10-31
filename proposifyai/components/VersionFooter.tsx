'use client';

export default function VersionFooter() {
  const version = 'v2.7.0';
  const date = '2025-10-26';

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
