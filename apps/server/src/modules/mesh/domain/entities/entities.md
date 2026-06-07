# Entidades de mesh

Este apartado documenta objetos centrales del dominio de malla.

## Que debe ir aqui

- Entidades con identidad propia dentro de la malla.
- Comportamientos propios de esas entidades.
- Conversion a datos primitivos cuando sea necesario responder al cliente.

## Archivos actuales

- `course.entity.ts`: entidad `Asignatura`, con id, codigo, nombre, SCT, nivel, estado y prerequisitos. Permite cambiar estado de forma inmutable con `conEstado`.
- `prerequisite.entity.ts`: entidad `Prerequisito`, que representa la relacion entre una asignatura y su requisito.

## Que no debe ir aqui

- Entidades TypeORM. Esas pertenecen a `packages/database`.
- Servicios que operan sobre colecciones completas de asignaturas.
- DTOs de presentacion.
