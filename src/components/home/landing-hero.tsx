import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { UNIVERSITY_SHORT } from '@/lib/project-info'
import { cn } from '@/lib/utils'

const LandingHero = () => {
  return (
    <div className="bg-background font-sans">
      <section className="relative mx-auto max-w-7xl overflow-hidden px-6 pt-16 pb-24 text-center md:pt-24 md:pb-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 20%, color-mix(in oklab, var(--secondary) 45%, transparent), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 50%), linear-gradient(165deg, var(--background) 0%, var(--card) 50%, var(--accent) 100%)',
          }}
        />

        <p
          className="text-primary/70 animate-fade-in-up mb-6 text-sm font-bold tracking-[0.2em] uppercase"
          style={{ opacity: 0, animationDelay: '0.1s' }}
        >
          {UNIVERSITY_SHORT} · guía fácil
        </p>

        <h1
          className="animate-fade-in-up font-display mb-5 text-6xl leading-[1.1] font-bold tracking-tight md:text-7xl lg:text-[80px]"
          style={{ opacity: 0, animationDelay: '0.2s' }}
        >
          <span className="text-foreground block">Entiende tu fila.</span>
          <span className="from-primary via-muted-foreground to-primary/40 block bg-linear-to-r bg-clip-text text-transparent">
            Sin fórmulas raras.
          </span>
        </h1>

        <p
          className="text-muted-foreground animate-fade-in-up mx-auto mb-8 max-w-2xl text-lg md:text-xl"
          style={{ opacity: 0, animationDelay: '0.3s' }}
        >
          Te explicamos, con ejemplos de negocios reales, cómo medir esperas, ocupación y clientes
          que se quedan fuera — aunque nunca hayas oído hablar de colas.
        </p>

        <div style={{ opacity: 0, animationDelay: '0.4s' }} className="animate-fade-in-up mb-12">
          <Link
            to="/models"
            className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8 py-3 text-base')}
          >
            Analizar mi operación
          </Link>
        </div>

        <div
          className="animate-fade-in-up border-border relative flex h-100 items-center justify-center overflow-hidden rounded-3xl  bg-  linear-to-b md:h-100"
          style={{ opacity: 0, animationDelay: '0.5s' }}
        >
          <img
            src="/Queue-cuate.svg"
            alt="Personas esperando en una fila mientras alguien las atiende"
            className="h-full w-full max-w-3xl object-contain p-6 select-none md:p-10"
            draggable={false}
          />
        </div>
      </section>
    </div>
  )
}

export default LandingHero
