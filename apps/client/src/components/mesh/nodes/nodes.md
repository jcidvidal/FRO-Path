# Nodes de la malla

Este apartado debe documentar los componentes encargados de representar asignaturas como nodos dentro de la malla curricular.

## Que debe ir aqui

- Componentes de tarjeta, bloque o nodo de asignatura.
- Estados visuales: aprobada, reprobada, en curso, bloqueada y disponible.
- Informacion minima visible por asignatura: codigo, nombre, SCT, nivel y estado.
- Acciones disponibles sobre una asignatura, como seleccionar o cambiar estado.
- Reglas de accesibilidad para colores, foco, etiquetas y navegacion por teclado.

## Que no debe ir aqui

- Conexiones entre asignaturas. Eso pertenece a `components/mesh/edges`.
- Calculo de desbloqueos o validacion de prerrequisitos. Eso pertenece al backend.
- Layout general de pagina. Eso pertenece a `layouts` o a la pantalla que use la malla.

## Estado actual

Todavia no hay implementaciones en esta carpeta. Cuando se agreguen nodos, documentar aqui sus props, estados visuales y ejemplos de uso.
