# Infraestructura IA de mesh

Este apartado documenta adaptadores de analisis de carga academica.

## Que debe ir aqui

- Fachadas que implementen `PuertoAnalisisIa`.
- Prompts, plantillas o criterios de analisis si se integra un modelo real.
- Mapeo entre seleccion de asignaturas, SCT, advertencias y recomendaciones.
- Manejo de errores del proveedor de IA.

## Archivo actual

- `static-ai-analysis.facade.ts`: implementacion estatica que devuelve resumen, advertencias y recomendaciones sin llamar a un servicio externo.

## Pendiente de definir

- Proveedor real de IA, si se usara.
- Politica para explicar al usuario cuando el analisis es automatico y cuando es solo orientativo.
- Criterios academicos exactos para considerar una carga como riesgosa.
