# Puertos de mesh

Este apartado documenta interfaces que el dominio o la aplicacion necesitan, pero cuya implementacion concreta puede cambiar.

## Que debe ir aqui

- Interfaces para repositorios de malla.
- Interfaces para servicios externos de IA.
- Tokens de inyeccion usados por NestJS para conectar contratos con implementaciones.

## Archivos actuales

- `mesh-repository.port.ts`: define `PuertoRepositorioMalla`, usado para buscar mallas por carrera y guardar estado de asignaturas.
- `ai-analysis.port.ts`: define `PuertoAnalisisIa`, entrada y resultado esperado para el analisis de carga academica.

## Que no debe ir aqui

- Clases concretas que acceden a memoria, PostgreSQL o proveedores de IA.
- DTOs HTTP.
- Reglas de negocio que no sean contratos.
