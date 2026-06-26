# Application de mesh

Esta capa coordina los casos de uso del modulo de malla. Debe contener la logica de aplicacion que conecta controladores, dominio e infraestructura.

## Que debe ir aqui

- Casos de uso como obtener malla, cambiar estado y analizar carga.
- Servicios de aplicacion que coordinan varias reglas de dominio.
- Handlers de eventos de dominio cuando una accion requiere efectos derivados.
- Orquestacion de puertos, repositorios y servicios externos.

## Que no debe ir aqui

- Decoradores HTTP de NestJS. Deben ir en `presentation`.
- Implementaciones concretas de base de datos o IA. Deben ir en `infrastructure`.
- Reglas puras que no dependen de flujo de aplicacion. Deben ir en `domain`.

## Archivos actuales

- `use-cases/get-mesh.use-case.ts`: obtiene la malla por carrera.
- `use-cases/change-course-status.use-case.ts`: cambia estado y valida prerequisitos antes de aprobar.
- `use-cases/analyze-mesh-load.use-case.ts`: delega el analisis a un puerto de IA.
- `services/unlock-cascading.service.ts`: calcula asignaturas desbloqueadas despues de aprobar un ramo.
- `handlers/course-approved.handler.ts`: punto de extension para reaccionar a aprobaciones.
