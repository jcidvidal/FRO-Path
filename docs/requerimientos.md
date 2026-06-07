# Requerimientos del Sistema: FRO-Path

Este documento define lo que el sistema debe hacer y las propiedades tecnicas que debe cumplir. Debe actualizarse cada vez que cambie una funcionalidad esperada o una restriccion de calidad.

## 1. Requerimientos funcionales

- **RF-01: Seleccion de carrera.** El sistema debe permitir alternar entre las carreras soportadas por la primera version.
- **RF-02: Visualizacion interactiva.** El sistema debe mostrar asignaturas organizadas por nivel, area y creditos SCT.
- **RF-03: Gestion de estados.** El usuario debe poder marcar asignaturas segun estados academicos definidos por el sistema.
- **RF-04: Validacion de prerrequisitos.** El sistema debe bloquear o advertir cuando se intente aprobar una asignatura sin cumplir sus prerrequisitos.
- **RF-05: Contador de creditos.** El sistema debe calcular y mostrar en tiempo real creditos SCT aprobados, totales y porcentaje de avance.
- **RF-06: Analisis de carga academica.** El sistema debe entregar advertencias y recomendaciones sobre la carga seleccionada.

## 2. Requerimientos no funcionales

- **RNF-01: Rendimiento.** La carga inicial de la malla y el cambio entre carreras debe completarse en menos de 2 segundos en condiciones normales.
- **RNF-02: Responsividad.** La interfaz debe ser funcional en escritorio y dispositivos moviles.
- **RNF-03: Persistencia.** La informacion de mallas y estados del usuario debe almacenarse de forma consistente cuando se integre la base de datos final.
- **RNF-04: Seguridad de tipos.** El proyecto debe pasar verificaciones TypeScript antes de despliegue.
- **RNF-05: Disponibilidad.** El sistema debe estar accesible via web durante el periodo de evaluacion.
- **RNF-06: Claridad academica.** Las recomendaciones deben comunicarse como apoyo orientativo, no como decision oficial de inscripcion.

## Decision pendiente

Confirmar si las carreras de la primera version son ICC/II o ICC/ICI. La documentacion queda neutral hasta cerrar esta decision.
