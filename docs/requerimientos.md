# Requerimientos del Sistema: FRO-Path

Este documento define lo que el sistema debe hacer y las propiedades tecnicas que debe cumplir. Debe actualizarse cada vez que cambie una funcionalidad esperada, una restriccion de calidad o el alcance de carreras soportadas.

## Carreras soportadas

La primera version de FRO-Path debe soportar solo estas carreras:

- Ingenieria Civil Informatica (ICI).
- Ingenieria Informatica (II).

No se deben incluir otras carreras en esta version.

## 1. Requerimientos funcionales

| ID | Titulo | Descripcion | Prioridad |
| :--- | :--- | :--- | :--- |
| RF-01 | Gestion de Estados | El sistema debe permitir que el estudiante gestione el estado de sus asignaturas, usando estados como aprobado, reprobado, cursando, bloqueado y disponible, para reflejar su situacion academica real. | Alta |
| RF-02 | Validacion de Prerrequisitos | El sistema debe validar los prerrequisitos antes de habilitar asignaturas superiores, para asegurar el cumplimiento del plan curricular. | Alta |
| RF-03 | Calculo de Avance Academico | El sistema debe calcular el avance del estudiante considerando asignaturas aprobadas, en curso y faltantes, para mostrar su progreso real. | Alta |
| RF-04 | Barra de Progreso Curricular | El sistema debe mostrar una barra de avance de la malla curricular para visualizar el porcentaje completado. | Alta |
| RF-05 | Visualizacion de Creditos SCT | El sistema debe mostrar los creditos SCT de cada asignatura para apoyar la planificacion semestral del estudiante. | Alta |
| RF-06 | Gestion de Roles | El sistema debe permitir al SuperAdmin asignar roles de Director y Profesor para administrar permisos del sistema. | Alta |
| RF-07 | Acceso de Director | El sistema debe permitir que el Director de Carrera visualice el avance academico de los estudiantes bajo su gestion. | Alta |
| RF-08 | Analisis de Complejidad Semestral | El sistema debe calcular la carga academica del semestre segun creditos SCT para orientar la toma de ramos. | Media |
| RF-09 | Navegacion entre Mallas | El sistema debe permitir que Directores y Profesores naveguen entre distintas mallas curriculares para fines academicos y administrativos. | Media |
| RF-10 | Calculo de Asignaturas Faltantes | El sistema debe identificar automaticamente las asignaturas pendientes para el egreso del estudiante. | Media |
| RF-11 | Control de Usuarios | El sistema debe permitir que el Director elimine o desactive estudiantes por motivos administrativos. | Media |
| RF-12 | Cambio de Malla | El sistema debe mostrar un boton de cambio de malla solo para Director y Profesor, para gestionar distintas carreras o versiones curriculares. | Media |

## 2. Requerimientos no funcionales

| ID | Categoria ISO/IEC 25010 | Descripcion medible | Verificacion |
| :--- | :--- | :--- | :--- |
| RNF-01 | Rendimiento | El sistema debe modificar el estado de una asignatura en menos de 1 segundo. | Prueba funcional midiendo el tiempo de respuesta. |
| RNF-02 | Rendimiento | El sistema debe realizar el cambio entre mallas curriculares en menos de 1 segundo. | Prueba de navegacion midiendo tiempo de carga. |
| RNF-03 | Rendimiento | El sistema debe mostrar el calculo de avance academico en menos de 3 segundos. | Prueba con datos de estudiantes y devtools. |
| RNF-04 | Usabilidad | La interfaz debe ser responsiva y adaptarse correctamente a notebook, tablet y movil. | Prueba visual en al menos 3 tamanos de pantalla. |
| RNF-05 | Seguridad | El sistema debe utilizar HTTPS para proteger la comunicacion entre cliente y servidor. | Verificacion mediante navegador o inspeccion del certificado SSL. |
| RNF-06 | Seguridad | El sistema debe usar tokens de autenticacion con tiempo de expiracion para controlar sesiones. | Prueba de login y validacion de expiracion del token. |
| RNF-07 | Seguridad | El sistema debe restringir el acceso a funcionalidades segun roles: Estudiante, Profesor, Director y Admin. | Prueba intentando acceder con usuarios de distintos roles. |
| RNF-08 | Confiabilidad | El sistema debe mantener la informacion academica consistente al actualizar estados de asignaturas. | Prueba actualizando estados y verificando que avance y prerrequisitos se recalculen correctamente. |
| RNF-09 | Mantenibilidad | El sistema debe separar la logica de roles, mallas, asignaturas y avance academico en modulos o componentes independientes. | Revision de codigo y estructura del proyecto. |
| RNF-10 | Compatibilidad | El sistema debe funcionar correctamente en navegadores modernos como Chrome, Edge y Firefox. | Prueba de compatibilidad en al menos 3 navegadores. |
