# Modulo progress

Modulo responsable de calcular el avance academico del estudiante a partir de la malla y los estados de asignaturas.

## Que debe ir aqui

- Endpoint de progreso bajo `/progress`.
- Caso de uso para calcular estadisticas de avance.
- Estrategias de calculo, por ejemplo porcentaje por creditos SCT.
- Entidades de resultado como estadisticas de progreso.

## Que no debe ir aqui

- Cambio de estado de asignaturas. Eso pertenece a `mesh`.
- Visualizacion de barras de progreso. Eso pertenece al frontend.
- Persistencia fisica de progreso academico. Eso pertenece a infraestructura o `packages/database`.

## Flujo principal

1. `ProgressController` recibe `idCarrera`.
2. `CalcularProgresoEstudianteUseCase` obtiene asignaturas desde el repositorio de malla.
3. La estrategia de calculo suma SCT totales y SCT aprobados.
4. Se devuelve porcentaje y creditos calculados.
