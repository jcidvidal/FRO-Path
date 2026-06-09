# Modulo common del backend

Este apartado debe contener piezas compartidas internas del servidor.

## Que debe ir aqui

- Filtros, interceptores, pipes o guards reutilizables en varios modulos.
- Constantes internas del backend que no sean contrato con el frontend.
- Utilidades especificas de NestJS usadas por mas de un modulo.
- Manejo transversal de errores, logging o validacion.

## Que no debe ir aqui

- DTOs compartidos con el cliente. Deben ir en `packages/common`.
- Reglas especificas de malla o progreso.
- Entidades de base de datos.

## Estado actual

No hay implementaciones en este apartado. Si se agregan utilidades comunes, documentar aqui su objetivo y en que modulos se usan.
