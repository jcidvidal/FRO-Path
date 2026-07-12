# FRO-Path
README ejecutable con:

Descripción breve del producto.

Prerrequisitos.

Comandos únicos para levantar local (Docker/compose o scripts) y ejecutar pruebas.

.env.example en caso de ser necesario.

URL de despliegue (web/API) o enlace a APK (móvil).

## Descripción breve del producto

## Prerequisitos para ejecutarlo
Para esto considerar los principales sistemas los cuales son windowns, linux y macos

## Los compnados para levantar el Docker

Esto hay qu everlo bien
## .env.example en caso de ser necesario.

## URL de despliegue (web/API) o enlace a APK (móvil).


---

## Prerrequisitos

Para ejecutar el proyecto localmente de cualquiera de las dos formas, asegúrate de tener instalado:

1. **Node.js** (Versión recomendada: `24.14.1` o compatible)
2. **npm** (Versión recomendada: `11.11.0` o compatible)
3. **Docker** y **Docker Compose** (Necesario para base de datos y despliegue rápido)

---

## Comandos Únicos para Levantar Local

### Opción A: Levantar Todo con Docker Compose (Recomendado)
Este comando único levanta la base de datos PostgreSQL, el servidor NestJS y el cliente React en sus respectivos contenedores de forma automatizada:

```bash
docker compose up --build
```
* Una vez levantado:
  * **Frontend (Cliente):** `http://localhost:5173`
  * **Backend (Servidor API):** `http://localhost:3000`

---

### Opción B: Levantar con Scripts Locales (Desarrollo Local)
Si deseas levantar los servicios directamente con Node:

1. **Instalar dependencias:**
   ```bash
   npm run install:all
   ```
2. **Levantar base de datos en segundo plano:**
   ```bash
   docker compose up -d db
   ```
3. **Iniciar el servidor API (Backend - NestJS):**
   ```bash
   npm run dev:server
   ```
4. **Iniciar el cliente web (Frontend - React + Vite):**
   ```bash
   npm run dev:client
   ```

---

## Comandos para Ejecutar Pruebas y Cobertura

Puedes ejecutar las pruebas de cada workspace desde la raíz del proyecto usando los siguientes comandos:

### 1. Servidor Backend (NestJS / Jest)
* **Ejecutar pruebas unitarias:**
  ```bash
  npm run test --workspace=@fro-path/server
  ```
* **Ejecutar cobertura de código (Coverage):**
  ```bash
  npm run test:cov --workspace=@fro-path/server
  ```

### 2. Cliente Frontend (React / Vitest)
* **Ejecutar pruebas unitarias:**
  ```bash
  npm run test --workspace=@fro-path/client
  ```
* **Ejecutar cobertura de código (Coverage):**
  ```bash
  npm run test:coverage --workspace=@fro-path/client
  ```

---

## Configuración de Variables de Entorno (`.env`)

El backend requiere ciertas configuraciones que se definen en el archivo `.env`. Se incluye una plantilla en [apps/server/.env.example](./apps/server/.env.example). 

Para comenzar:
1. Copia el archivo de ejemplo:
   ```bash
   cp apps/server/.env.example apps/server/.env
   ```
2. Si deseas habilitar el análisis de carga académica por IA, obtén una clave de API en [Google AI Studio](https://aistudio.google.com/apikey) y configúrala en el parámetro:
   ```env
   GEMINI_API_KEY=tu-clave-de-api-de-gemini
   ```

Las credenciales por defecto de la base de datos están preconfiguradas para funcionar directamente con el servicio de Docker.

---

## URLs de Despliegue

Actualmente, el proyecto está preparado para su despliegue continuo en la nube:

* **Frontend Web (Vercel):** [https://fro-path-client.vercel.app](https://fro-path-client.vercel.app) *(TBD / Próximamente)*
* **Backend API (Despliegue Externo):** [https://fro-path-server.onrender.com](https://fro-path-server.onrender.com) *(TBD / Próximamente)*
* **Base de datos (PostgreSQL Cloud):** Hospedada en servicio compatible con TypeORM.

---
Visualizador interactivo de progreso academico para estudiantes de carreras informaticas de la Universidad de La Frontera.

FRO-Path busca ayudar a estudiantes a entender su avance curricular, visualizar prerrequisitos, simular estados de asignaturas y revisar una orientacion de carga academica basada en creditos SCT.

## Apartados principales

- `apps/client`: frontend React + Vite.
- `apps/server`: backend NestJS.
- `packages/common`: contratos compartidos entre cliente y servidor.
- `packages/database`: entidades TypeORM y configuracion de PostgreSQL.
- `docs`: documentacion de alcance, requerimientos, viabilidad y decisiones tecnicas.

## Documentacion por apartado

- [Frontend](apps/client.md)
- [Backend](apps/server.md)
- [Cliente React](apps/client/README.md)
- [Servidor NestJS](apps/server/README.md)
- [Contratos compartidos](packages/common/common.md)
- [Base de datos](packages/database/database.md)
- [Alcance](docs/alcance.md)
- [Requerimientos](docs/requerimientos.md)
- [Viabilidad](docs/viabilidad.md)
- [Matriz comparativa](docs/matriz-comparativa.md)
- [Vercel](vercel.md)

## Stack tecnologico

| Componente | Tecnologia |
| :--- | :--- |
| Monorepo | npm workspaces |
| Lenguaje | TypeScript |
| Frontend | React + Vite |
| Backend | NestJS |
| Base de datos | PostgreSQL + TypeORM |
| CI | GitHub Actions |

## Modelo de datos conceptual

```mermaid
erDiagram
    CARRERA ||--o{ ASIGNATURA : contiene
    ASIGNATURA ||--o{ PRERREQUISITO : tiene
    USUARIO ||--o{ PROGRESO_ACADEMICO : registra
    ASIGNATURA ||--o{ PROGRESO_ACADEMICO : aparece_en

    CARRERA {
        int id
        string codigo
        string nombre
    }

    ASIGNATURA {
        int id
        string codigo_ramo
        string nombre
        int sct
        int nivel
        int carrera_id
    }

    PRERREQUISITO {
        int asignatura_id
        int requisito_id
    }

    USUARIO {
        int id
        string nombre
        string email
        string password
    }

    PROGRESO_ACADEMICO {
        int usuario_id
        int asignatura_id
        string estado
    }
```

## Comandos del monorepo

```bash
npm install
npm run install:all
npm run dev:client
npm run dev:server
npm run build
npm run test
```

## Desarrollo local

Para ejecutar el cliente:

```bash
npm run dev:client
```

Para ejecutar el servidor:

```bash
npm run dev:server
```

## CI

El proyecto usa GitHub Actions para validar cambios hacia ramas principales. La intencion del pipeline es instalar dependencias, compilar los workspaces relevantes y ejecutar pruebas antes de integrar cambios.

## Carreras soportadas

La primera version de FRO-Path soporta Ingenieria Civil Informatica (ICI) e Ingenieria Informatica (II). No se incluyen otras carreras en esta version.

## Equipo

Proyecto desarrollado para el ramo de Proyecto de Aplicacion - UFRO 2026.
