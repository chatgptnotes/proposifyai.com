// Version tracking for Proposify AI
// Auto-updated on each push/save

export const APP_VERSION = {
  version: "1.0.0",
  lastUpdated: "2025-01-25",
  buildNumber: 1,
};

export function getVersionString(): string {
  return `v${APP_VERSION.version}`;
}

export function getFullVersionInfo(): string {
  return `Version ${APP_VERSION.version} | Last updated: ${APP_VERSION.lastUpdated} | Build ${APP_VERSION.buildNumber}`;
}

export function getFormattedDate(): string {
  const date = new Date(APP_VERSION.lastUpdated);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
