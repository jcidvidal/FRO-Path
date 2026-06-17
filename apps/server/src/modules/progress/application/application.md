# Application de progress

Esta capa coordina el calculo de progreso academico.

## Que debe ir aqui

- Casos de uso que respondan preguntas de avance academico.
- Coordinacion entre repositorio de malla y estrategia de calculo.
- Transformacion final hacia datos primitivos para el controlador.

## Archivo actual

- `calculate-student-progress.use-case.ts`: obtiene asignaturas por carrera y delega el calculo a la estrategia configurada.

## Que no debe ir aqui

- Formula concreta de calculo, si puede reemplazarse por estrategia.
- Decoradores HTTP.
- Consultas concretas a base de datos.
