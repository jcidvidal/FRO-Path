# Cliente React

Aplicacion web de FRO-Path. Este paquete contiene la interfaz que permite al estudiante ver su malla, seleccionar carrera, revisar estados de asignaturas y consultar su avance academico.

## Responsabilidad del apartado

- Renderizar la experiencia visual de la malla curricular.
- Consumir los endpoints del backend para obtener malla, progreso y analisis.
- Mantener estado de sesion, validaciones de formularios y persistencia local de datos temporales.
- Mostrar errores y advertencias de forma comprensible para el usuario.

## Estructura esperada

- `src/App.tsx`: composicion principal de la aplicacion.
- `src/components`: componentes visuales reutilizables.
- `src/components/mesh`: piezas especificas del visualizador de malla.
- `src/services`: servicios de autenticacion, storage y validacion.
- `src/hooks`: hooks reutilizables cuando exista logica de React compartida.
- `src/layouts`: estructuras de pantalla o shells de navegacion.
- `src/store`: estado global o stores de cliente.
- `src/test`: configuracion de pruebas.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run test
```

Desde la raiz del monorepo tambien se puede ejecutar:

```bash
npm run dev:client
npm run build:client
```

## Criterios para agregar codigo

- Si el codigo dibuja o coordina UI, debe vivir en `components`, `layouts` o `App.tsx`.
- Si el codigo valida datos, administra storage o encapsula acceso externo, debe vivir en `services`.
- Si el codigo representa contratos compartidos con backend, debe moverse a `packages/common`.
- Si una regla decide si una asignatura puede aprobarse, debe vivir en backend, no en el cliente.
