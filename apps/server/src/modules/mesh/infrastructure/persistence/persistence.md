# Persistencia de mesh

Este apartado documenta repositorios concretos del modulo de malla.

## Que debe ir aqui

- Implementaciones de `PuertoRepositorioMalla`.
- Acceso a datos de asignaturas, estados y prerequisitos.
- Mapeadores entre entidades de base de datos y entidades de dominio.
- Estrategias temporales de datos en memoria mientras no exista persistencia final.

## Archivo actual

- `in-memory-mesh.repository.ts`: repositorio en memoria con una malla de ejemplo para la carrera `informatica`.

## Que no debe ir aqui

- Definicion global de entidades TypeORM compartidas. Eso pertenece a `packages/database`.
- Reglas para aprobar asignaturas.
- Endpoints HTTP.

## Pendiente de definir

- Si el repositorio final usara directamente `packages/database` con TypeORM.
- Estrategia para persistir progreso por usuario real.
