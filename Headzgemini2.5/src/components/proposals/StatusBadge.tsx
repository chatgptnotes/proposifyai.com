'use client';

import { ProposalStatusType, getProposalStatusColor } from '@/lib/proposals/validation';

interface StatusBadgeProps {
  status: ProposalStatusType;
  className?: string;
}

const statusLabels: Record<ProposalStatusType, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  signed: 'Signed',
  declined: 'Declined',
  expired: 'Expired',
};

const statusStyles: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const color = getProposalStatusColor(status);
  const label = statusLabels[status];
  const style = statusStyles[color] || statusStyles.gray;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-60`} />
      {label}
    </span>
  );
}
