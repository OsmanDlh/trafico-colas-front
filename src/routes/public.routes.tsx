import type { RouteObject } from 'react-router-dom'

import AppLayout from '@/components/layouts/app-layout'
import CostsPage from '@/pages/costs/costs-page'
import DecisionPage from '@/pages/decision/decision-page'
import HomePage from '@/pages/home/home-page'
import ModelsPage from '@/pages/models/models-page'

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'models', element: <ModelsPage /> },
      { path: 'costs', element: <CostsPage /> },
      { path: 'decision', element: <DecisionPage /> },
    ],
  },
]

export default publicRoutes
