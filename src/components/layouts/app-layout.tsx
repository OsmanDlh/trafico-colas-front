import { NavLink, Outlet } from 'react-router-dom'

import AppFooter from '@/components/layouts/app-footer'
import { LOGO_SRC, PRODUCT_NAME, UNIVERSITY_SHORT } from '@/lib/project-info'
import { cn } from '@/lib/utils'
import { useHealth } from '@/services/health.service'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/models', label: 'Mi operación' },
  { to: '/costs', label: 'Ahorrar' },
  { to: '/decision', label: 'Recomendaciones' },
]

const AppLayout = () => {
  const { isError, isLoading } = useHealth()

  const statusLabel = isLoading ? 'Conectando…' : isError ? 'Sin conexión' : 'Listo'
  const statusTone = isLoading
    ? 'bg-muted text-muted-foreground'
    : isError
      ? 'bg-danger-soft text-destructive'
      : 'bg-success-soft text-success'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-card/90 sticky top-0 z-10 border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-4 md:gap-6">
            <NavLink to="/" className="flex min-w-0 items-center gap-2.5">
              <img
                src={LOGO_SRC}
                alt={`Logo ${UNIVERSITY_SHORT}`}
                className="h-9 w-auto shrink-0 object-contain sm:h-10"
              />
              <div className="min-w-0">
                <p className="font-display text-foreground truncate text-lg leading-tight font-bold">
                  {PRODUCT_NAME}
                </p>
                <p className="text-muted-foreground hidden truncate text-xs sm:block">
                  Proyecto {UNIVERSITY_SHORT}
                </p>
              </div>
            </NavLink>
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-semibold', statusTone)}>
            {statusLabel}
          </span>
        </div>
        <nav className="border-border flex gap-1 overflow-x-auto border-t px-4 py-2 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
