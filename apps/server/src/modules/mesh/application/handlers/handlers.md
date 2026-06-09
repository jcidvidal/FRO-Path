# Handlers de mesh

Este apartado documenta manejadores de eventos o acciones secundarias del modulo de malla.

## Que debe ir aqui

- Handlers que reaccionen a eventos de dominio, como una asignatura aprobada.
- Acciones derivadas que no deben ensuciar el caso de uso principal.
- Integraciones asincronas futuras, por ejemplo notificaciones o auditoria.

## Que no debe ir aqui

- Reglas para aprobar asignaturas.
- Controladores HTTP.
- Persistencia concreta.

## Archivo actual

- `course-approved.handler.ts`: manejador para el evento de asignatura aprobada. Actualmente funciona como punto de extension para efectos posteriores.
