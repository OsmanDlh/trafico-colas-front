import { Outlet, useLocation } from 'react-router-dom'

import AppFooter from '@/components/layouts/app-footer'
import AppHeader from '@/components/layouts/app-header'
import { cn } from '@/lib/utils'

const AppLayout = () => {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main
        className={cn(
          'w-full flex-1',
          isLanding ? 'max-w-none p-0' : 'mx-auto max-w-7xl p-4 md:p-6 lg:p-8',
        )}
      >
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
