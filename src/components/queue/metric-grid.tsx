import type { MetricItem } from '@/utils/queue-metrics'

type MetricGridProps = {
  items: MetricItem[]
}

const MetricGrid = ({ items }: MetricGridProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.key} className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {item.label}
          </p>
          <p className="text-foreground mt-1 text-2xl font-semibold tabular-nums">{item.value}</p>
          <p className="text-muted-foreground mt-1 text-xs">{item.hint}</p>
        </div>
      ))}
    </div>
  )
}

export type { MetricGridProps }

export { MetricGrid }
