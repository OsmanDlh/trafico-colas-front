import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

type HeroTab = 'guia' | 'operacion' | 'ahorros' | 'decidir'

type TabOverlayProps = {
  activeTab: HeroTab
}

const TabOverlay = ({ activeTab }: TabOverlayProps) => {
  return (
    <div
      key={activeTab}
      className="animate-fade-in-overlay pointer-events-none absolute inset-0"
      style={{ opacity: 0 }}
    >
      <div className="animate-slide-up-overlay absolute top-1/2 left-1/2 w-[min(100%-2rem,22rem)]">
        {activeTab === 'guia' && <GuiaOverlay />}
        {activeTab === 'operacion' && <OperacionOverlay />}
        {activeTab === 'ahorros' && <AhorrosOverlay />}
        {activeTab === 'decidir' && <DecidirOverlay />}
      </div>
    </div>
  )
}

const OverlayCard = ({ children }: { children: ReactNode }) => (
  <div className="border-border bg-card/95 text-card-foreground pointer-events-auto rounded-2xl border p-5 text-left shadow-xl backdrop-blur-sm">
    {children}
  </div>
)

const GuiaOverlay = () => {
  const steps = ['¿Cuántos atienden?', '¿Hay cupo?', 'Elige el caso', 'Mira el ejemplo']
  return (
    <OverlayCard>
      <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
        Guía fácil
      </p>
      <h3 className="font-display text-foreground mb-4 text-lg font-semibold">
        Elige tu caso en dos preguntas
      </h3>
      <div className="bg-muted mb-2 h-2 overflow-hidden rounded-full">
        <div className="bg-secondary h-full w-1/4 rounded-full" />
      </div>
      <p className="text-muted-foreground mb-4 text-xs">Paso 1 de 4 · 25%</p>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li
            key={step}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
              index === 0
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                index === 0
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </OverlayCard>
  )
}

const OperacionOverlay = () => {
  const metrics = [
    { label: 'Espera', value: '4.2 min' },
    { label: 'En fila', value: '3.1' },
    { label: 'Ocupación', value: '78%' },
    { label: 'Modelo', value: 'MMSK' },
  ]
  return (
    <OverlayCard>
      <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
        Mi operación
      </p>
      <h3 className="font-display text-foreground mb-4 text-lg font-semibold">
        Resultados de tu fila
      </h3>
      <div className="bg-muted mb-2 h-2 overflow-hidden rounded-full">
        <div className="bg-warning h-full w-2/3 rounded-full" />
      </div>
      <p className="text-muted-foreground mb-4 text-xs">Análisis listo · 67%</p>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-warning-soft rounded-lg px-3 py-2">
            <p className="text-warning text-[11px]">{metric.label}</p>
            <p className="text-foreground text-sm font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
    </OverlayCard>
  )
}

const AhorrosOverlay = () => (
  <OverlayCard>
    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">Costos</p>
    <h3 className="font-display text-foreground mb-4 text-lg font-semibold">
      Dónde puedes ahorrar
    </h3>
    <div className="bg-success-soft mb-4 flex items-center gap-3 rounded-xl px-4 py-3">
      <span className="bg-success text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full">
        <Check className="h-5 w-5" strokeWidth={3} />
      </span>
      <div>
        <p className="text-success text-sm font-semibold">Escenario viable</p>
        <p className="text-success/80 text-xs">Menos espera · mismo ritmo</p>
      </div>
    </div>
    <ul className="text-muted-foreground space-y-2 text-sm">
      {['Costo por espera baja', 'Mejor uso del personal', 'Menos clientes fuera'].map((item) => (
        <li key={item} className="flex items-center gap-2">
          <Check className="text-success h-4 w-4" />
          {item}
        </li>
      ))}
    </ul>
  </OverlayCard>
)

const DecidirOverlay = () => {
  const items = [
    { label: 'Mediste tu operación', done: true },
    { label: 'Revisaste costos', done: true },
    { label: 'Comparaste escenarios', done: true },
    { label: 'Eliges qué cambiar', done: false },
  ]
  return (
    <OverlayCard>
      <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
        Recomendaciones
      </p>
      <h3 className="font-display text-foreground mb-4 text-lg font-semibold">
        Decide el siguiente paso
      </h3>
      <ul className="mb-5 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="text-foreground flex items-center gap-2 text-sm">
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full',
                item.done
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border bg-card border',
              )}
            >
              {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
      <Link
        to="/decision"
        className={cn(buttonVariants({ size: 'sm' }), 'w-full rounded-full')}
      >
        Ver recomendaciones
      </Link>
    </OverlayCard>
  )
}

export type { HeroTab }
export default TabOverlay
