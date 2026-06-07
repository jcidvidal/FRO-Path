# Modulo mesh

Modulo responsable de la malla curricular. Aqui vive la logica para obtener asignaturas por carrera, cambiar estados, validar prerequisitos, desbloquear asignaturas dependientes y solicitar analisis de carga academica.

## Que debe ir aqui

- Controladores HTTP bajo `/mesh`.
- Casos de uso relacionados con malla curricular.
- Entidades de dominio como asignatura y prerequisito.
- Especificaciones de negocio para aprobar o bloquear asignaturas.
- Puertos para repositorios y analisis de IA.
- Implementaciones de infraestructura para persistencia o proveedores de IA.

## Que no debe ir aqui

- Calculo general de porcentaje de avance SCT. Eso pertenece al modulo `progress`.
- Componentes del frontend para dibujar la malla.
- Entidades TypeORM compartidas del paquete `database`.

## Flujo principal

1. `MeshController` recibe la solicitud HTTP.
2. Un caso de uso de `application` coordina la accion.
3. Las reglas se validan usando objetos de `domain`.
4. Los datos se leen o guardan mediante un puerto implementado en `infrastructure`.
5. La respuesta vuelve al frontend como datos primitivos.
