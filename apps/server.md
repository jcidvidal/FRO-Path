# Apartado Backend

Este apartado documenta la aplicacion backend de FRO-Path, construida con NestJS y TypeScript. Aqui debe explicarse la logica de negocio que permite obtener la malla, cambiar estados de asignaturas, validar prerrequisitos, calcular progreso SCT y entregar un analisis de carga academica.

## Que debe ir aqui

- Arquitectura general del backend y sus modulos.
- Endpoints disponibles y responsabilidad de cada controlador.
- Casos de uso de aplicacion, servicios de dominio y puertos.
- Reglas de negocio para aprobar asignaturas, desbloquear ramos y calcular progreso.
- Integracion actual o futura con servicios de IA.
- Manejo de errores y excepciones esperadas.

## Que no debe ir aqui

- Componentes visuales o decisiones de interfaz. Eso pertenece al frontend.
- Detalles fisicos de tablas TypeORM. Eso pertenece a `packages/database`.
- Documentacion de despliegue de Vercel. Eso pertenece a `vercel.md`.

## Relacion con otros apartados

- `apps/server/README.md`: instrucciones tecnicas para ejecutar el servidor.
- `apps/server/src/modules/mesh`: logica de malla curricular y prerrequisitos.
- `apps/server/src/modules/progress`: calculo de progreso academico.
- `packages/common`: contratos compartidos con el cliente.
