# Infrastructure de mesh

Esta capa contiene implementaciones tecnicas para los puertos definidos en dominio.

## Que debe ir aqui

- Repositorios concretos de malla.
- Fachadas o clientes para servicios de IA.
- Adaptadores hacia base de datos, archivos, APIs externas o memoria.
- Mapeos entre modelos externos y entidades de dominio.

## Que no debe ir aqui

- Reglas de negocio puras.
- Controladores HTTP.
- Componentes de frontend.

## Implementaciones actuales

- `persistence/in-memory-mesh.repository.ts`: repositorio temporal en memoria para obtener y guardar estados de asignaturas.
- `ai/static-ai-analysis.facade.ts`: fachada estatica de analisis de IA para responder recomendaciones sin proveedor externo real.
