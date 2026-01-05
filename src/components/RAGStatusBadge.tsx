import { RAGStatus } from '@/types/status';
import { cn } from '@/lib/utils';

interface RAGStatusBadgeProps {
  status: RAGStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig = {
  red: {
    label: 'High Load',
    dotClass: 'bg-status-red',
    bgClass: 'bg-status-red-bg',
    textClass: 'text-status-red',
  },
  amber: {
    label: 'Moderate',
    dotClass: 'bg-status-amber',
    bgClass: 'bg-status-amber-bg',
    textClass: 'text-status-amber',
  },
  green: {
    label: 'On Track',
    dotClass: 'bg-status-green',
    bgClass: 'bg-status-green-bg',
    textClass: 'text-status-green',
  },
};

const sizeConfig = {
  sm: { dot: 'h-2 w-2', text: 'text-xs', padding: 'px-2 py-0.5' },
  md: { dot: 'h-2.5 w-2.5', text: 'text-sm', padding: 'px-2.5 py-1' },
  lg: { dot: 'h-3 w-3', text: 'text-base', padding: 'px-3 py-1.5' },
};

export function RAGStatusBadge({ status, size = 'md', showLabel = true }: RAGStatusBadgeProps) {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgClass,
        config.textClass,
        sizes.padding
      )}
    >
      <span className={cn('rounded-full', config.dotClass, sizes.dot)} />
      {showLabel && <span className={sizes.text}>{config.label}</span>}
    </div>
  );
}
