import { Link, NavLink } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button-variants'
import { LOGO_SRC, PRODUCT_NAME, UNIVERSITY_SHORT } from '@/lib/project-info'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/#guia-facil', label: 'Guía fácil', hash: true },
  { to: '/models', label: 'Mi operación' },
  { to: '/costs', label: 'Ahorrar' },
  { to: '/decision', label: 'Recomendaciones' },
] as const

const AppHeader = () => {
  return (
    <header className="border-border bg-card/90 sticky top-0 z-10 border-b backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-foreground flex shrink-0 items-center gap-2.5">
          <img
            src={LOGO_SRC}
            alt={`Logo ${UNIVERSITY_SHORT}`}
            className="h-8 w-auto object-contain sm:h-9"
          />
          <span className="text-lg font-semibold">{PRODUCT_NAME}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) =>
            'hash' in item && item.hash ? (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm transition-colors',
                    isActive
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/#guia-facil"
            className="text-muted-foreground hover:text-foreground hidden text-sm transition-colors sm:inline"
          >
            Ver la guía
          </Link>
          <Link
            to="/models"
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-5 py-2.5')}
          >
            Analizar ahora
          </Link>
        </div>
      </nav>

      <div className="border-border flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-xl px-3 py-1.5 text-sm font-semibold',
              isActive
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-muted',
            )
          }
        >
          Inicio
        </NavLink>
        {navItems
          .filter((item) => !('hash' in item && item.hash))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-xl px-3 py-1.5 text-sm font-semibold',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
      </div>
    </header>
  )
}

export default AppHeader
