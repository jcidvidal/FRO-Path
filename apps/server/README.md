# Servidor NestJS

API de FRO-Path. Este paquete contiene los endpoints y la logica de negocio para consultar mallas curriculares, cambiar estados de asignaturas, validar prerrequisitos, calcular avance SCT y producir analisis de carga academica.

## Responsabilidad del apartado

- Exponer endpoints HTTP para el frontend.
- Coordinar casos de uso de aplicacion.
- Mantener reglas de dominio independientes de NestJS cuando sea posible.
- Conectar puertos de dominio con implementaciones de infraestructura.
- Entregar respuestas tipadas y errores claros.

## Estructura esperada

- `src/main.ts`: arranque de NestJS.
- `src/app.module.ts`: modulo raiz.
- `src/modules/mesh`: malla curricular, prerrequisitos, estados y analisis.
- `src/modules/progress`: calculo de avance academico.
- `test`: pruebas e2e.

## Endpoints actuales

- `GET /mesh/:idCarrera`: obtiene la malla de una carrera.
- `PATCH /mesh/:idCarrera/estado`: cambia el estado de una asignatura.
- `POST /mesh/:idCarrera/analisis-ia`: analiza la carga academica seleccionada.
- `GET /progress/:idCarrera`: calcula avance SCT de una carrera.

## Comandos

```bash
npm install
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

Desde la raiz del monorepo tambien se puede ejecutar:

```bash
npm run dev:server
npm run build:server
npm run test
```

## Criterios para agregar codigo

- Si recibe HTTP, pertenece a `presentation`.
- Si coordina una accion del usuario o del sistema, pertenece a `application`.
- Si expresa reglas de negocio puras, pertenece a `domain`.
- Si conecta con base de datos, IA u otro proveedor externo, pertenece a `infrastructure`.
- Si es contrato compartido con frontend, debe vivir en `packages/common`.
