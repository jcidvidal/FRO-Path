# Specifications de mesh

Este apartado documenta reglas de negocio expresadas como specifications.

## Que debe ir aqui

- Reglas booleanas que respondan si una accion academica esta permitida.
- Validaciones de dominio reutilizables por uno o mas casos de uso.
- Explicacion de prerequisitos y condiciones de aprobacion.

## Archivo actual

- `can-approve-course.specification.ts`: valida si una asignatura puede aprobarse revisando que todos sus prerequisitos esten en estado aprobado.

## Que no debe ir aqui

- Validaciones de formato de DTO.
- Mensajes HTTP de error.
- Calculos de UI o estilos visuales.
