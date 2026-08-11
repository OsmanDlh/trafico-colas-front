import { cn } from '@/lib/utils'
import type { StatusTone } from '@/utils/status-tone'

type StatusBadgeProps = {
  label: string
  tone?: StatusTone
  className?: string
}

const toneClasses: Record<StatusTone, string> = {
  ok: 'bg-success-soft text-success',
  warn: 'bg-warning-soft text-warning',
  critical: 'bg-danger-soft text-destructive',
  unstable: 'bg-destructive text-destructive-foreground',
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-secondary text-secondary-foreground',
}

const StatusBadge = ({ label, tone = 'neutral', className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  )
}

export type { StatusBadgeProps }

export { StatusBadge }
