# Services del cliente

Este apartado documenta servicios y utilidades del frontend que no son componentes visuales.

## Que debe ir aqui

- `AuthContext.tsx`: contexto de autenticacion simulado, usuarios mock y acciones de login, registro y logout.
- `storage.ts`: wrapper para persistencia local segura frente a errores de navegador.
- `rutValidator.ts`: limpieza, formato y validacion de RUT chileno.
- `validators.ts`: reglas reutilizables para formularios.
- Pruebas asociadas a validadores y autenticacion.

## Que no debe ir aqui

- Componentes visuales.
- Reglas de dominio que el backend debe validar oficialmente.
- Entidades TypeORM o persistencia de servidor.

## Criterios para agregar servicios

- Si la utilidad se puede probar sin renderizar React, puede vivir aqui.
- Si la utilidad encapsula una API del navegador, debe quedar aqui o en un hook si depende de ciclo de vida React.
- Si el servicio consume backend, documentar endpoint, forma de error esperada y DTO usado desde `packages/common`.
