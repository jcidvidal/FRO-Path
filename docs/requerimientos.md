# Requerimientos del Sistema: FRO-Path

## 1. Requerimientos Funcionales (RF)
Son las funciones específicas que el usuario podrá realizar en la plataforma.

- **RF-01: Selección de Carrera:** El sistema debe permitir al usuario alternar entre la visualización de la malla de Ingeniería Civil Informática (ICC) e Ingeniería Informática(II).
- **RF-02: Visualización Interactiva:** El sistema debe mostrar las asignaturas organizadas por niveles, áreas y créditos SCT.
- **RF-03: Gestión de Estados:** El usuario debe poder marcar cada asignatura como "Pendiente", "Cursando" o "Aprobada".
- **RF-04: Validación de Prerrequisitos:** El sistema debe bloquear o advertir si un usuario intenta marcar como "Aprobada" una materia cuyos prerrequisitos no han sido cumplidos.
- **RF-05: Contador de Créditos:** El sistema debe calcular y mostrar en tiempo real la suma de créditos SCT de las materias seleccionadas o aprobadas.

## 2. Requerimientos No Funcionales (RNF)
Son las propiedades técnicas y de calidad que debe cumplir el software.

- **RNF-01: Rendimiento:** La carga inicial de la malla y el cambio entre carreras debe realizarse en menos de 2 segundos.
- **RNF-02: Responsividad:** La interfaz debe ser funcional tanto en computadores de escritorio como en dispositivos móviles (browser).
- **RNF-03: Persistencia de Datos:** La información de las mallas y los estados del usuario deben almacenarse de forma consistente en una base de datos PostgreSQL.
- **RNF-04: Seguridad de Tipos:** El proyecto debe pasar todas las verificaciones de TypeScript en el pipeline de CI antes de cualquier despliegue.
- **RNF-05: Disponibilidad:** El sistema debe ser accesible vía web de forma permanente durante el periodo de evaluación.
