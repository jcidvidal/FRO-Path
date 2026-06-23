# Matriz Comparativa Tecnica: FRO-Path

Este documento registra las decisiones tecnicas principales y por que se eligieron. Debe actualizarse cuando el equipo cambie una tecnologia o descarte una alternativa relevante.

## Matriz de decision

| Item | Opcion elegida | Alternativa evaluada | Justificacion tecnica |
| :--- | :--- | :--- | :--- |
| Arquitectura backend | NestJS | Express.js | NestJS entrega modulos, inyeccion de dependencias y una estructura clara para reglas complejas de prerrequisitos. |
| Base de datos | PostgreSQL | MongoDB | Las mallas son datos relacionales; PostgreSQL ayuda a mantener integridad entre asignaturas, carreras y prerrequisitos. |
| Frontend | React + Vite | Angular / Vue | React tiene un ecosistema amplio para interfaces interactivas y Vite acelera desarrollo y build. |
| Lenguaje | TypeScript | JavaScript | El tipado reduce errores entre frontend, backend y contratos compartidos. |
| Gestion del proyecto | GitHub Projects | Trello / Jira | Centraliza codigo, issues, PRs y trazabilidad en el mismo ecosistema. |
| Monorepo | npm workspaces | Repos separados | Permite compartir contratos entre apps y paquetes sin duplicar codigo. |

## Estimacion inicial

- Configuracion de CI: media, porque requiere definir comandos por workspace.
- Documentacion base: baja a media, porque depende de cerrar decisiones de alcance.
- Modelado de base de datos: alta, porque es el nucleo de prerrequisitos y progreso.
- Visualizador interactivo: alta, porque requiere claridad visual y manejo de estados.
- Integracion backend-frontend: media, porque los contratos ya pueden vivir en `packages/common`.

## Criterio para nuevas decisiones

Cada decision tecnica nueva debe registrar:

- Problema que resuelve.
- Alternativas evaluadas.
- Motivo de eleccion.
- Riesgo o costo asumido.
