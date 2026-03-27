# Matriz de Comparación de Ítems Técnicos - FRO-Path

Para la selección del stack tecnológico, el equipo evaluó diversas alternativas bajo criterios de mantenibilidad, escalabilidad y facilidad de implementación para el contexto de la UFRO.

## 📊 Matriz de Decisión

| Ítem | Opción Elegida | Alternativa Evaluada | Justificación Técnica |
| :--- | :--- | :--- | :--- |
| **Arquitectura Backend** | **NestJS** | Express.js | NestJS ofrece una arquitectura modular y orientada a objetos (similar a Angular/Spring), facilitando la organización de la lógica compleja de prerrequisitos. |
| **Motor de Base de Datos** | **PostgreSQL** | MongoDB | Las mallas académicas son datos altamente relacionales. PostgreSQL garantiza integridad referencial, vital para que no existan "nodos huérfanos" en la malla. |
| **Framework Frontend** | **React + Vite** | Angular / Vue | React posee el ecosistema más amplio de librerías para visualización de grafos y nodos, ideal para una malla interactiva. Vite acelera el desarrollo significativamente. |
| **Lenguaje** | **TypeScript** | JavaScript | El tipado fuerte reduce errores en tiempo de ejecución, permitiendo que el pipeline de CI detecte fallos antes del despliegue. |
| **Gestión de Proyecto** | **GitHub Projects** | Trello / Jira | Centraliza el código, la documentación y las tareas en un solo ecosistema, mejorando la trazabilidad para el equipo y el docente. |

## 🃏 Estimación (Planning Poker)
Se realizó una sesión de estimación simplificada para las tareas críticas del Hito 1:
- **Configuración de CI:** Media (5 pts) - Requiere conocimientos de YAML y Actions.
- **Documentación Base:** Baja (3 pts) - Definición de requerimientos y alcance.
- **Modelado de Base de Datos:** Alta (8 pts) - Es el núcleo de la lógica de FRO-Path.