# Presentation de progress

Esta capa expone el calculo de progreso mediante HTTP.

## Que debe ir aqui

- Controladores NestJS del modulo progress.
- DTOs de entrada o salida si el endpoint crece.
- Adaptacion entre parametros HTTP y casos de uso.

## Archivo actual

- `progress.controller.ts`: expone `GET /progress/:idCarrera` para calcular avance academico de una carrera.

## Que no debe ir aqui

- Formula de calculo SCT.
- Reglas de dominio.
- Acceso a base de datos.
