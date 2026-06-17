# Estudio de Viabilidad: FRO-Path

Este documento justifica si el proyecto puede realizarse con los recursos, plazos y restricciones disponibles.

## 1. Viabilidad tecnica

El proyecto es tecnicamente factible usando herramientas modernas y conocidas por el equipo.

- **Backend:** NestJS permite una arquitectura modular para separar controladores, casos de uso, dominio e infraestructura.
- **Frontend:** React con Vite permite construir una interfaz interactiva y rapida para visualizar la malla.
- **Base de datos:** PostgreSQL es adecuado para representar relaciones entre carreras, asignaturas, prerrequisitos, usuarios y progreso academico.
- **CI:** GitHub Actions puede verificar instalacion, build y pruebas antes de integrar cambios.
- **Despliegue:** El frontend puede desplegarse en Vercel y el backend puede proyectarse en servicios compatibles con Node.js.

## 2. Viabilidad legal y normativa

El sistema debe operar como herramienta de apoyo academico, sin reemplazar sistemas oficiales de la UFRO.

- Las mallas curriculares deben obtenerse desde fuentes oficiales o validadas.
- El uso de datos personales debe limitarse a lo necesario.
- Las recomendaciones del sistema deben ser informativas y no vinculantes.
- Si se almacenan credenciales, deben protegerse con mecanismos seguros; no corresponde guardar contrasenas en texto plano.

## 3. Viabilidad economica y de tiempo

- **Costo inicial:** el proyecto puede construirse con herramientas open source y servicios gratuitos para evaluacion.
- **Plazo academico:** se proyecta dentro del periodo Marzo - Julio 2026.
- **Riesgo principal:** la integracion completa entre frontend, backend y base de datos puede requerir mas tiempo que una version simulada en memoria.

## 4. Viabilidad operativa

El equipo puede dividir el trabajo por capas:

- Frontend: visualizacion e interaccion con la malla.
- Backend: reglas de negocio, endpoints y analisis.
- Base de datos: modelo relacional y persistencia.
- Documentacion y CI: trazabilidad, calidad y entrega.

## Riesgos a monitorear

- Confirmacion de carreras soportadas.
- Datos oficiales de mallas y prerrequisitos.
- Persistencia real del progreso por usuario.
- Definicion final del proveedor o mecanismo de IA.
