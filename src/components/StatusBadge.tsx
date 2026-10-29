import React from 'react';
import { RequestStatus, PriorityLevel } from '../types';

interface StatusBadgeProps {
  status?: RequestStatus;
  priority?: PriorityLevel;
  isEmergency?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, isEmergency, size = 'md' }) => {
  if (isEmergency) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
        Emergency
      </span>
    );
  }

  if (priority && !status) {
    const priorityConfig = {
      routine: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', label: 'Routine' },
      urgent: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', label: 'Urgent' },
      emergency: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Emergency' },
    }[priority];

    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-full ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'}`}>
        {priorityConfig.label}
      </span>
    );
  }

  if (!status) return null;

  const statusConfig: Record<RequestStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      label: 'Pending Review'
    },
    assigned: {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      dot: 'bg-sky-500',
      label: 'Assigned to Volunteer'
    },
    in_progress: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      dot: 'bg-teal-600',
      label: 'In Progress'
    },
    completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-600',
      label: 'Completed'
    },
    cancelled: {
      bg: 'bg-stone-100',
      text: 'text-stone-600',
      border: 'border-stone-200',
      dot: 'bg-stone-400',
      label: 'Cancelled'
    }
  };

  const conf = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${conf.bg} ${conf.text} border ${conf.border} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {conf.label}
    </span>
  );
};
