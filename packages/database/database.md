# Paquete database

Este paquete documenta la capa de persistencia compartida de FRO-Path. Su responsabilidad es definir entidades TypeORM y configuracion de conexion para PostgreSQL.

## Que debe ir aqui

- Entidades TypeORM persistentes.
- Configuracion de `DataSource`.
- Scripts o instrucciones para levantar PostgreSQL local.
- Migraciones o seeds si se agregan en el futuro.
- Relaciones entre carrera, asignatura, prerequisito, usuario y progreso academico.

## Que no debe ir aqui

- Reglas de negocio de aprobacion de asignaturas.
- Controladores HTTP.
- Componentes visuales.
- DTOs compartidos con frontend.

## Entidades actuales

- `Carrera`: codigo y nombre de la carrera.
- `Asignatura`: codigo, nombre, SCT, nivel y carrera asociada.
- `Prerrequisito`: relacion entre asignatura y requisito.
- `Usuario`: datos basicos de usuario.
- `ProgresoAcademico`: estado de una asignatura para un usuario.

## Pendiente de definir

- Estrategia de migraciones.
- Politica de almacenamiento de contrasenas, porque el campo `password` no debe persistirse en texto plano en un entorno real.
- Integracion final entre los repositorios del backend y estas entidades.
