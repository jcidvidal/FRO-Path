# Hooks

Este apartado debe documentar hooks de React reutilizables.

## Que debe ir aqui

- Hooks que encapsulen estado o efectos compartidos entre componentes.
- Hooks para consumir servicios del cliente, como malla, progreso o autenticacion.
- Hooks para manejar seleccion de carrera, filtros o estado visual complejo.
- Hooks de integracion con storage o APIs del navegador.

## Que no debe ir aqui

- Funciones puras de validacion. Deben ir en `services`.
- Stores globales si se decide usar una libreria especifica. Deben ir en `src/store`.
- Componentes visuales.

## Estado actual

No hay hooks definidos aun. Cuando se agreguen, documentar firma, retorno, efectos secundarios y dependencias externas.
