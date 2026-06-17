# Apartado Frontend

Este apartado documenta la aplicacion web de FRO-Path, construida con React, TypeScript y Vite. Aqui debe explicarse todo lo relacionado con la experiencia visual e interactiva del estudiante: seleccion de carrera, visualizacion de malla, estados de asignaturas, barra de avance y presentacion del analisis de carga academica.

## Que debe ir aqui

- Descripcion general de la interfaz y sus flujos principales.
- Como se organiza la aplicacion dentro de `apps/client`.
- Componentes visuales relevantes para la malla curricular.
- Servicios del navegador, validadores, contexto de autenticacion y persistencia local.
- Indicaciones para ejecutar, probar y compilar el frontend.
- Decisiones de UX que afecten la forma en que el estudiante entiende su progreso.

## Que no debe ir aqui

- Reglas de negocio de prerrequisitos o calculo de progreso. Eso pertenece al backend.
- Entidades persistentes de base de datos. Eso pertenece a `packages/database`.
- Contratos compartidos entre frontend y backend. Eso pertenece a `packages/common`.

## Relacion con otros apartados

- `apps/client/README.md`: instrucciones tecnicas para ejecutar el cliente.
- `apps/client/src/components`: componentes reutilizables de interfaz.
- `apps/client/src/services`: servicios, validadores y contexto de autenticacion.
- `packages/common`: DTOs y tipos compartidos que debe consumir el cliente.
