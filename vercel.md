# Vercel

Este documento debe explicar como se despliega FRO-Path en Vercel y que rol cumple `vercel.json`.

## Que debe ir aqui

- Configuracion de rutas para frontend y API.
- Variables de entorno necesarias para despliegue.
- Comandos de build usados por Vercel.
- Limitaciones de ejecutar NestJS como funcion serverless, si aplica.
- Pasos para validar que el despliegue funciona.

## Estado actual

`vercel.json` existe pero esta vacio. Antes de desplegar se debe definir si Vercel alojara solo el frontend o tambien redirigira rutas de API hacia un backend serverless/externo.

## Pendiente de definir

- Proyecto de Vercel asociado.
- Build command del monorepo.
- Output directory del cliente.
- URL final del backend.
- Variables de entorno para base de datos e IA.
