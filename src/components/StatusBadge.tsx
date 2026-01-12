import React from 'react';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'idle' | 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === 'idle') return null;

  const config = {
    queued: { icon: Clock, text: 'Queued', color: 'text-blue-400' },
    in_progress: { icon: Loader2, text: 'Processing...', color: 'text-amber-400' },
    completed: { icon: CheckCircle2, text: 'Completed', color: 'text-emerald-400' },
    failed: { icon: XCircle, text: 'Failed', color: 'text-red-400' },
    nsfw: { icon: XCircle, text: 'NSFW Detected', color: 'text-red-400' },
  };

  const current = config[status as keyof typeof config];
  const Icon = current.icon;

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${current.color}`}>
      <Icon className={`w-4 h-4 ${status === 'in_progress' ? 'animate-spin' : ''}`} />
      {current.text}
    </div>
  );
};
