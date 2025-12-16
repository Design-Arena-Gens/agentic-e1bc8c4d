import { DealerStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: DealerStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' },
    fcu_review: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'FCU Review' },
    credit_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Credit Review' },
    ops_review: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Ops Review' },
    app_support: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'App Support' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
