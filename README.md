# FRO-Path

## Descripcion del Producto
FRO-Path es una plataforma web interactiva diseñada para la visualización, simulación y planificación del progreso académico de los estudiantes de las carreras de Ingeniería Civil Informática (ICI) e Ingeniería Informática (II) de la Universidad de La Frontera (UFRO).

Permite a los estudiantes interactuar con su malla, simular avances (marcando ramos como aprobados, reprobados o cursando), calcular créditos SCT y recibir tutoría académica automatizada de carga de ramos basada en la API de Gemini.

---

## Prerrequisitos
Antes de levantar el proyecto de forma local, asegúrate de tener instalado:
*   **Node.js:** Versión `24.14.1` o compatible.
*   **npm:** Versión `11.11.0` o compatible.
*   **Docker y Docker Compose:** Requerido para la base de datos PostgreSQL o para levantar todo el monorepo. Asegúrate de tener **Docker Desktop** abierto y ejecutándose.

---

## Comandos Unicos para Levantar Local y Ejecutar Pruebas

### 1. Levantar de forma local

#### Opcion A: Con Docker Compose (Todo en contenedores - Recomendado)
Este comando único descarga las imágenes, crea los volúmenes, levanta la base de datos PostgreSQL, compila el servidor API en NestJS y la aplicación en React:
```bash
docker compose up --build
```
Una vez levantado:
*   **Frontend (Cliente):** [http://localhost:5173](http://localhost:5173)
*   **Backend (Servidor API):** [http://localhost:3000](http://localhost:3000)

#### Opcion B: Con Scripts Locales (Desarrollo nativo)
Si prefieres depurar y ejecutar los servicios en tu máquina nativa:
1.  **Instalar dependencias del monorepo:**
    ```bash
    npm install
    ```
2.  **Levantar solo el contenedor de Base de Datos en segundo plano:**
    ```bash
    docker compose up -d db
    ```
3.  **Ejecutar Servidor Backend (NestJS):**
    ```bash
    npm run dev:server
    ```
4.  **Ejecutar Cliente Frontend (React):**
    ```bash
    npm run dev:client
    ```

---

### 2. Ejecutar Pruebas y Cobertura
Puedes ejecutar las suites de pruebas globales directamente desde el directorio raíz del monorepo:

*   **Ejecutar todos los tests (Servidor + Cliente):**
    ```bash
    npm run test:all
    ```
*   **Ejecutar todas las coberturas de código (Coverage):**
    ```bash
    npm run test:cov:all
    ```

O comandos individuales por workspace:
*   **Pruebas Backend (Jest):** `npm run test --workspace=@fro-path/server`
*   **Pruebas Frontend (Vitest):** `npm run test:client`

---

## Configuracion de Variables de Entorno (.env)
El backend del proyecto utiliza variables de entorno locales. Se incluye un archivo de plantilla en [apps/server/.env.example](file:///c:/Users/hayat/VSCodium/FRO-Path/apps/server/.env.example).

Para comenzar a usarlo:
1.  **Copia la plantilla de ejemplo:**
    ```bash
    cp apps/server/.env.example apps/server/.env
    ```
2.  **Completa las variables requeridas en el archivo `.env`:**
    *   `GEMINI_API_KEY`: Clave secreta obtenida de Google AI Studio para habilitar el Orientador por IA.
    *   `JWT_SECRET`: Secreto seguro para la firma de tokens de autenticación de usuarios.

---

## URLs de Despliegue
El proyecto se encuentra desplegado en entornos en la nube y listo para su uso continuo:

*   **Frontend Web (Vercel):** [https://fro-path-client.vercel.app](https://fro-path-client.vercel.app)
*   **Backend API (Render):** [https://fro-path-server.onrender.com](https://fro-path-server.onrender.com)