import { createBrowserRouter } from 'react-router-dom'

import NotFoundPage from '@/pages/not-found-page'
import publicRoutes from '@/routes/public.routes'

const appRouter = createBrowserRouter([
  ...publicRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default appRouter
