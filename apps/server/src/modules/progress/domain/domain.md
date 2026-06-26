# Domain de progress

Esta capa contiene conceptos y reglas para medir avance academico.

## Que debe ir aqui

- Entidad de estadisticas de progreso.
- Estrategias de calculo de avance.
- Puertos para intercambiar estrategias.
- Entidades academicas necesarias para representar estudiantes, profesores, directores, mallas y asignaturas dentro del contexto de progreso.
- Enums de carrera y estados cuando sean propios de este modulo.

## Archivos actuales

- `progress-stats.entity.ts`: representa SCT aprobados, SCT totales y porcentaje.
- `sct-progress.strategy.ts`: calcula avance usando creditos SCT aprobados sobre creditos totales.
- `calculation-strategy.port.ts`: contrato para cambiar la estrategia de calculo.
- `entities`: modelo academico del contexto de progreso.
- `enums`: estados y carreras del contexto.

## Que no debe ir aqui

- Endpoints HTTP.
- Componentes de frontend.
- Repositorios concretos.
