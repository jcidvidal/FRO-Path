# Paquete common

Este paquete es el contrato compartido entre frontend y backend. Debe contener tipos TypeScript, DTOs y enums que ambos lados necesitan para hablar el mismo idioma.

## Que debe ir aqui

- Enums compartidos, como `EstadoAsignatura`.
- DTOs de malla, asignatura, cambio de estado, progreso y analisis de IA.
- Tipos que formen parte de la API publica entre cliente y servidor.

## Que no debe ir aqui

- Implementaciones de React.
- Controladores o servicios de NestJS.
- Entidades TypeORM.
- Reglas de negocio con dependencias de infraestructura.

## Archivo actual

- `src/index.ts`: exporta los contratos principales usados por el frontend y el backend.

## Criterio de cambio

Si se cambia un tipo de este paquete, revisar ambos lados del monorepo porque probablemente afecta compilacion del cliente y del servidor.
