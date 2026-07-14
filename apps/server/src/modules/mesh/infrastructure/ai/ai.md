# Infraestructura IA de mesh

Este apartado documenta adaptadores de analisis de carga academica.

## Que debe ir aqui

- Fachadas que implementen `PuertoAnalisisIa`.
- Prompts, plantillas o criterios de analisis si se integra un modelo real.
- Calculo de la carga academica en creditos SCT y su traduccion a un comentario orientativo.
- Manejo de errores del proveedor de IA.

## Archivos actuales

- `gemini-ai-analysis.facade.ts`: adaptador real de Google Gemini. Recibe la carga en SCT (en curso, aprobados y total) y devuelve un comentario en prosa sobre la carga academica.
- `static-ai-analysis.facade.ts`: implementacion estatica de respaldo cuando no hay `GEMINI_API_KEY` configurada.

## Clasificacion de la carga

La categoria (ligero / equilibrado / excesivo) NO la decide la IA: se calcula de
forma determinista en `domain/services/clasificar-carga-academica.ts`. El
criterio que manda es el numero de ramos en curso; la suma de SCT actua solo
como guardia que puede elevar la carga a "excesivo".

- Ligero: 1-3 ramos en curso.
- Equilibrado: 4-5 ramos en curso.
- Excesivo: mas de 5 ramos en curso, o suma de SCT mayor a 30.

Las fachadas de IA reciben la categoria ya resuelta y solo la redactan; no la
recalculan ni la contradicen. El use-case obtiene el desglose desde la malla del
estudiante (no confia en datos enviados por el cliente).

## Pendiente de definir

- Proveedor real de IA, si se usara.
- Politica para explicar al usuario cuando el analisis es automatico y cuando es solo orientativo.
- Si el criterio debe incorporar tambien el peso por ramo (3 ramos de 7 SCT, etc.),
  hoy cubierto indirectamente por la guardia de suma de SCT.
