# Domain de mesh

Esta capa contiene el modelo de negocio de la malla curricular. Debe poder entenderse sin depender de NestJS, HTTP o base de datos.

## Que debe ir aqui

- Entidades del dominio, como asignatura y prerequisito.
- Value objects, como estado de asignatura.
- Eventos de dominio.
- Puertos que describen dependencias externas.
- Specifications para reglas como "puede aprobar asignatura".

## Que no debe ir aqui

- Decoradores de NestJS.
- DTOs de entrada HTTP.
- Consultas SQL, TypeORM o repositorios concretos.
- Detalles visuales del frontend.

## Regla general

Si el codigo representa una verdad del negocio academico de FRO-Path, debe estar aqui. Si representa una tecnologia concreta, debe estar fuera.
