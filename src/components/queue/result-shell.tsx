import type { ReactNode } from 'react'

import { StatusBadge } from '@/components/queue/status-badge'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description: string
  className?: string
}

const EmptyState = ({ title, description, className }: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'border-border bg-muted/30 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center',
        className,
      )}
    >
      <p className="text-foreground text-base font-semibold">{title}</p>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">{description}</p>
    </div>
  )
}

type ResultShellProps = {
  title: string
  badge?: string
  badgeTone?: 'ok' | 'warn' | 'critical' | 'unstable' | 'neutral' | 'info'
  children: ReactNode
  className?: string
}

const ResultShell = ({
  title,
  badge,
  badgeTone = 'info',
  children,
  className,
}: ResultShellProps) => {
  return (
    <section
      className={cn('border-border bg-card space-y-4 rounded-xl border p-5 shadow-sm', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
        {badge ? <StatusBadge label={badge} tone={badgeTone} /> : null}
      </div>
      {children}
    </section>
  )
}

export type { EmptyStateProps, ResultShellProps }

export { EmptyState, ResultShell }
