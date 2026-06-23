# Edges de la malla

Este apartado debe documentar los componentes encargados de dibujar conexiones entre asignaturas dentro del visualizador de malla.

## Que debe ir aqui

- Componentes que representen relaciones de prerrequisito entre nodos.
- Estilos o variantes visuales para conexiones bloqueadas, cumplidas o advertidas.
- Logica de presentacion para resaltar dependencias al seleccionar una asignatura.
- Adaptadores visuales si se usa una libreria de grafo o canvas.

## Que no debe ir aqui

- Reglas para decidir si un prerrequisito esta cumplido. Esa regla pertenece al backend.
- DTOs compartidos. Deben ir en `packages/common`.
- Componentes de asignatura individuales. Deben ir en `components/mesh/nodes`.

## Estado actual

Todavia no hay implementaciones en esta carpeta. Cuando se creen, este documento debe listar los componentes disponibles y el significado visual de cada tipo de conexion.
