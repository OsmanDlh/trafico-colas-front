# Tráfico y Colas — React + TypeScript + Tailwind CSS 4

Frontend para la API **trafico-colas**: analiza sistemas M/M/1, M/M/1/K, M/M/S y M/M/S/K,
optimiza costos y apoya decisiones de capacidad. **No requiere login.**

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS 4**
- **React Router DOM** — rutas públicas
- **React Query** — mutaciones/consultas a la API
- **React Hook Form** + **Zod** — formularios con validación
- **Axios** — cliente HTTP (`lib/api-client.ts`)
- **React Hot Toast** — notificaciones

## Inicio rápido

1. Arranca la API (repo `Trafico_Colas`):

```bash
uvicorn app.main:app --reload
```

2. Arranca el front:

```bash
npm install
cp .env.example .env
npm run dev
```

- Front: <http://localhost:5173>
- API docs: <http://127.0.0.1:8000/docs>

### Variables de entorno

```bash
VITE_API_URL=http://127.0.0.1:8000
```

## Endpoints conectados

Prefijo API: `/api/v1`

| Método | Endpoint                             | UI                       |
| ------ | ------------------------------------ | ------------------------ |
| GET    | `/api/v1/health`                     | Badge en header + inicio |
| POST   | `/api/v1/models/mm1`                 | `/models`                |
| POST   | `/api/v1/models/mm1k`                | `/models`                |
| POST   | `/api/v1/models/mms`                 | `/models`                |
| POST   | `/api/v1/models/mmsk`                | `/models`                |
| POST   | `/api/v1/costs/optimize`             | `/costs`                 |
| POST   | `/api/v1/decision/recommend-model`   | `/decision`              |
| POST   | `/api/v1/decision/capacity-planning` | `/decision`              |
| POST   | `/api/v1/decision/network-health`    | `/decision`              |
| POST   | `/api/v1/decision/compare-scenarios` | `/decision`              |

El JSON usa `"lambda"` (la API también acepta `"lambda_"`).

## Rutas

| Ruta        | Descripción                                  |
| ----------- | -------------------------------------------- |
| `/`         | Inicio + estado de la API                    |
| `/models`   | Medidas de rendimiento                       |
| `/costs`    | Optimización de E[CT]                        |
| `/decision` | Recomendación, capacidad, salud, comparación |
| `*`         | 404                                          |

## Estructura relevante

```
src/
├── components/queue/     # Formularios que llaman a la API
├── services/             # React Query: models, costs, decision, health
├── types/queue.type.ts   # Tipos request/response
├── lib/api-client.ts     # Axios → VITE_API_URL
├── lib/queue-schemas.ts  # Validación Zod
└── pages/                # Composición de vistas
```

### Servicios (patrón)

```tsx
const useAnalyzeMmsk = () =>
  useMutation({
    mutationFn: async (payload: MMSKRequest) => {
      const { data } = await apiClient.post<ModelResponse>('/api/v1/models/mmsk', payload)
      return data
    },
  })
```

## Convenciones

- Componentes con `const` + arrow function; exports al final
- Imports con alias `@/`
- Máximo ~350 líneas por archivo
- Feedback de errores de API (422) vía toast (`getApiErrorMessage`)

## Scripts

| Comando          | Descripción            |
| ---------------- | ---------------------- |
| `npm run dev`    | Servidor de desarrollo |
| `npm run build`  | Build de producción    |
| `npm run lint`   | ESLint                 |
| `npm run format` | Prettier               |
# trafico-colas-front
