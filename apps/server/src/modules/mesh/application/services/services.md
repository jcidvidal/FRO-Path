# Services de application mesh

Este apartado documenta servicios de aplicacion del modulo de malla.

## Que debe ir aqui

- Servicios que calculen resultados derivados para un caso de uso.
- Coordinacion reutilizable que no sea una entidad ni un controlador.
- Logica que necesita trabajar con varias asignaturas al mismo tiempo.

## Que no debe ir aqui

- Repositorios concretos.
- DTOs HTTP.
- Reglas de dominio atomicas que puedan expresarse como specification o value object.

## Archivo actual

- `unlock-cascading.service.ts`: determina que asignaturas quedan desbloqueadas despues de aprobar una asignatura, revisando prerequisitos contra el estado actual de la malla.
