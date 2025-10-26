export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function formatDays(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}mo ago`;
  return `${Math.floor(diffDay / 365)}y ago`;
}

export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  }[format];

  return new Intl.DateTimeFormat('en-US', options).format(targetDate);
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate, 'short');
  const end = formatDate(endDate, 'short');

  if (start === end) return start;
  return `${start} - ${end}`;
}

export function formatCompactNumber(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
  if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`;
  return `${(value / 1000000000).toFixed(1)}B`;
}

export function formatMetricChange(current: number, previous: number): {
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
  formatted: string;
} {
  const diff = current - previous;
  const percentage = previous > 0 ? (diff / previous) * 100 : 0;

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (percentage > 0) trend = 'up';
  if (percentage < 0) trend = 'down';

  const sign = percentage > 0 ? '+' : '';
  const formatted = `${sign}${percentage.toFixed(1)}%`;

  return {
    value: diff,
    percentage,
    trend,
    formatted,
  };
}

export function formatDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

export function formatBrowserName(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edg/i.test(userAgent)) return 'Edge';
  return 'Other';
}

export function formatLocation(ipData: any): string {
  if (!ipData) return 'Unknown';

  const parts = [];
  if (ipData.city) parts.push(ipData.city);
  if (ipData.region) parts.push(ipData.region);
  if (ipData.country) parts.push(ipData.country);

  return parts.join(', ') || 'Unknown';
}

export function getMetricColor(value: number, thresholds: { good: number; warning: number }): string {
  if (value >= thresholds.good) return 'text-green-600';
  if (value >= thresholds.warning) return 'text-yellow-600';
  return 'text-red-600';
}

export function getTrendIcon(trend: 'up' | 'down' | 'neutral'): string {
  return {
    up: '↗',
    down: '↘',
    neutral: '→',
  }[trend];
}

export function formatChartDate(date: string, interval: 'day' | 'week' | 'month'): string {
  const d = new Date(date);

  switch (interval) {
    case 'day':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'week':
      return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    case 'month':
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    viewed: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    viewed: 'Viewed',
    accepted: 'Won',
    rejected: 'Lost',
  };

  return labels[status] || status;
}

export function formatEngagementLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      level: 'High',
      color: 'text-green-600',
      description: 'Strong engagement',
    };
  }

  if (score >= 50) {
    return {
      level: 'Medium',
      color: 'text-yellow-600',
      description: 'Moderate engagement',
    };
  }

  return {
    level: 'Low',
    color: 'text-red-600',
    description: 'Limited engagement',
  };
}
