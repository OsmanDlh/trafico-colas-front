import type { RouteObject } from 'react-router-dom'

import AppLayout from '@/components/layouts/app-layout'
import ModelResultModal from '@/components/queue/model-result-modal'
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
      {
        path: 'models',
        element: <ModelsPage />,
        children: [{ path: 'resultado', element: <ModelResultModal /> }],
      },
      { path: 'costs', element: <CostsPage /> },
      { path: 'decision', element: <DecisionPage /> },
    ],
  },
]

export default publicRoutes
