import { useState } from 'react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { MODEL_CHOOSER_STEPS, MODEL_GUIDES, WORDS_GLOSSARY } from '@/lib/model-guides'
import { cn } from '@/lib/utils'
import type { ModelName } from '@/types/queue.type'

const MODEL_ORDER: ModelName[] = ['MM1', 'MM1K', 'MMS', 'MMSK']

const shortTitles: Record<ModelName, string> = {
  MM1: '1 persona · sin cupo',
  MM1K: '1 persona · con cupo',
  MMS: 'Varias · sin cupo',
  MMSK: 'Varias · con cupo',
}

const LandingGuide = () => {
  const [active, setActive] = useState<ModelName>('MMSK')
  const guide = MODEL_GUIDES[active]

  return (
    <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
      <section id="guia-facil" className="scroll-mt-24 space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-primary text-sm font-bold tracking-wide uppercase">Guía fácil</p>
          <h2 className="font-display text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Elige tu caso en dos preguntas
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            No memorices nombres raros. Responde cómo atiendes hoy y sabrás qué opción usar.
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-2">
          {MODEL_CHOOSER_STEPS.map((step, index) => (
            <li
              key={step.question}
              className="animate-[slideUp_450ms_ease-out] space-y-4"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-baseline gap-3">
                <span className="bg-secondary text-secondary-foreground flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="font-display text-foreground text-xl font-bold">{step.question}</h3>
              </div>
              <ul className="space-y-3 pl-12">
                {step.options.map((option) => (
                  <li key={option.label} className="border-border border-l-2 pl-4">
                    <p className="text-foreground text-sm font-semibold">{option.label}</p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      → {option.leadsTo}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-8" aria-labelledby="modelos-titulo">
        <div className="max-w-2xl space-y-3">
          <p className="text-primary text-sm font-bold tracking-wide uppercase">Los 4 escenarios</p>
          <h2
            id="modelos-titulo"
            className="font-display text-foreground text-3xl font-bold tracking-tight md:text-4xl"
          >
            Cómo se ve cada forma de atender
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Toca uno para leerlo con un ejemplo del día a día. Luego podrás medirlo en tu negocio.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Escenarios de atención"
          className="flex flex-wrap gap-2"
        >
          {MODEL_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              onClick={() => setActive(id)}
              className={cn(
                'rounded-2xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors',
                active === id
                  ? 'border-secondary bg-secondary text-secondary-foreground shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {shortTitles[id]}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          className="animate-[fadeIn_280ms_ease-out] grid gap-8 border-t border-dashed pt-8 lg:grid-cols-[1.1fr_0.9fr]"
          key={active}
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {guide.technicalName}
              </p>
              <h3 className="font-display text-foreground text-2xl font-bold">{guide.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">{guide.analogy}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-foreground text-sm font-bold">Úsalo cuando…</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{guide.whenToUse}</p>
              </div>
              <div className="space-y-2">
                <p className="text-foreground text-sm font-bold">No lo uses si…</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{guide.whenNotToUse}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-foreground text-sm font-bold">¿Por qué puede fallar?</p>
              <ul className="text-muted-foreground space-y-2 text-sm leading-relaxed">
                {guide.whyItCanFail.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className="text-primary shrink-0" aria-hidden>
                      •
                    </span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground space-y-4 rounded-3xl p-6 md:p-8">
            <p className="text-secondary text-xs font-bold tracking-wide uppercase">
              Ejemplo del día a día
            </p>
            <p className="text-base leading-relaxed text-white/90">{guide.example.story}</p>
            <p className="font-display text-lg font-bold text-white">{guide.example.numbers}</p>
            <div className="border-primary-foreground/20 space-y-2 border-t pt-4">
              <p className="text-sm font-semibold text-white">Datos que vas a indicar</p>
              <ul className="space-y-1.5 text-sm text-white/80">
                {guide.youNeed.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <Link
              to="/models"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-2 w-full sm:w-auto',
              )}
            >
              Medir este escenario
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="diccionario-titulo">
        <div className="max-w-2xl space-y-3">
          <p className="text-primary text-sm font-bold tracking-wide uppercase">Diccionario</p>
          <h2
            id="diccionario-titulo"
            className="font-display text-foreground text-3xl font-bold tracking-tight md:text-4xl"
          >
            Palabras que verás en la app
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Las traducimos a lenguaje de negocio para que nadie se quede fuera.
          </p>
        </div>

        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORDS_GLOSSARY.map((entry) => (
            <div key={entry.word} className="space-y-1.5">
              <dt className="font-display text-foreground text-lg font-bold">{entry.word}</dt>
              <dd className="text-muted-foreground text-sm leading-relaxed">{entry.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative overflow-hidden rounded-3xl px-6 py-12 text-center md:px-10 md:py-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, var(--primary) 0%, #3d4663 55%, color-mix(in oklab, var(--primary) 85%, var(--secondary)) 100%)',
          }}
        />
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="font-display text-3xl  md:text-4xl">
            ¿Ya sabes cómo atiendes?
          </h2>
          <p className="text-base leading-relaxed">
            Pasa a medir tu operación. Si algo no cuadra, te lo explicamos en palabras simples.
          </p>
          <Link
            to="/models"
            className={cn(buttonVariants({ size: 'lg' }), 'mt-2 inline-flex min-w-48')}
          >
            Ir a mi operación
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingGuide
