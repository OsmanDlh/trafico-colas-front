import { Link, Outlet } from 'react-router-dom'

import ModelsAnalyzer from '@/components/queue/models-analyzer'

const ModelsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-3xl space-y-2">
        <p className="text-primary text-sm font-bold tracking-wide uppercase">Mi operación</p>
        <h1 className="font-display text-foreground text-3xl font-bold">
          ¿Cómo está funcionando hoy?
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Elige cómo atiendes y completa los números. Al calcular se abre el resultado. Si aún no
          sabes qué escenario te corresponde,{' '}
          <Link to="/#guia-facil" className="text-primary font-semibold underline-offset-2 hover:underline">
            vuelve a la guía fácil
          </Link>
          .
        </p>
      </div>
      <ModelsAnalyzer />
      <Outlet />
    </div>
  )
}

export default ModelsPage
