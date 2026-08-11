import {
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
  HiOutlineStatusOnline,
} from 'react-icons/hi'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LOGO_SRC,
  PRODUCT_NAME,
  TEAM_MEMBERS,
  UNIVERSITY_NAME,
  UNIVERSITY_SHORT,
} from '@/lib/project-info'
import { cn } from '@/lib/utils'
import { useHealth } from '@/services/health.service'

const sections = [
  {
    to: '/models',
    title: 'Ver mi operación',
    description:
      'Descubre si tus clientes esperan demasiado y qué tan ocupado está tu equipo ahora mismo.',
    icon: HiOutlineChartBar,
    cta: 'Analizar',
  },
  {
    to: '/costs',
    title: 'Bajar costos',
    description:
      'Encuentra cuántas personas necesitas contratar para gastar menos sin empeorar el servicio.',
    icon: HiOutlineCurrencyDollar,
    cta: 'Optimizar',
  },
  {
    to: '/decision',
    title: 'Qué me conviene',
    description:
      'Recibe una recomendación clara: si todo va bien, si hay riesgo, o qué opción es mejor.',
    icon: HiOutlineClipboardCheck,
    cta: 'Decidir',
  },
]

const HomePage = () => {
  const { isError, isLoading } = useHealth()

  return (
    <div className="space-y-10">
      <section className="border-border bg-primary text-primary-foreground relative overflow-hidden rounded-3xl border p-8 shadow-lg md:p-10">
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="bg-secondary text-secondary-foreground inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
                Proyecto académico · {UNIVERSITY_SHORT}
              </p>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
              Menos esperas.
              <br />
              Mejores costos.
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg">
              {PRODUCT_NAME} te dice, en minutos, si tu negocio necesita más personal, más capacidad
              o solo ajustar el ritmo. Desarrollado en la {UNIVERSITY_NAME}.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/models" className={cn(buttonVariants({ size: 'lg' }), 'min-w-40')}>
                Empezar ahora
              </Link>
              <Link
                to="/decision"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent',
                )}
              >
                Ver recomendaciones
              </Link>
            </div>
          </div>

          <div className="bg-card/95 hidden rounded-2xl p-5 shadow-lg lg:block">
            <img
              src={LOGO_SRC}
              alt={`Logo ${UNIVERSITY_NAME}`}
              className="mx-auto h-20 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border px-4 py-3',
          isError ? 'border-destructive/30 bg-danger-soft' : 'border-border bg-card',
        )}
      >
        <HiOutlineStatusOnline
          className={cn('h-5 w-5 shrink-0', isError ? 'text-destructive' : 'text-success')}
        />
        <div>
          <p className="text-sm font-semibold">
            {isLoading
              ? 'Preparando tu panel…'
              : isError
                ? 'No podemos conectar con el servicio'
                : 'Todo listo para analizar tu negocio'}
          </p>
          <p className="text-muted-foreground text-xs">
            {isError
              ? 'Revisa que el servicio esté encendido e intenta de nuevo.'
              : 'Tus datos se usan solo para calcular. No necesitas crear cuenta.'}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-foreground text-2xl font-bold">
            Elige por dónde empezar
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tres caminos simples. Empieza por el que más te preocupe hoy.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Link
                key={section.to}
                to={section.to}
                className="group block transition-transform hover:-translate-y-1"
              >
                <Card className="border-border h-full overflow-hidden shadow-sm transition-shadow group-hover:shadow-md">
                  <div className="bg-secondary h-1.5 w-full" />
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-primary text-primary-foreground flex h-11 w-11 items-center justify-center rounded-2xl">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-muted-foreground text-xs font-bold">0{index + 1}</span>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="font-display text-xl">{section.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </div>
                    <span className="text-primary text-sm font-bold group-hover:underline">
                      {section.cta} →
                    </span>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="border-border bg-card rounded-3xl border p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-sm font-bold tracking-wide uppercase">Créditos</p>
            <h2 className="font-display text-foreground text-2xl font-bold">Equipo del proyecto</h2>
            <p className="text-muted-foreground max-w-md text-sm">
              Desarrollado como proyecto académico en la {UNIVERSITY_NAME}.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {TEAM_MEMBERS.map((member) => (
              <li
                key={member}
                className="border-border bg-muted/40 flex items-center gap-3 rounded-2xl border px-4 py-3"
              >
                <span className="bg-secondary text-secondary-foreground flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                  {member
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')}
                </span>
                <span className="text-foreground text-sm font-semibold">{member}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default HomePage
