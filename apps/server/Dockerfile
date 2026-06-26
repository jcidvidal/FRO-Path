# ── Etapa de construcción ─────────────────────────────────────
FROM node:24-bookworm-slim AS build
WORKDIR /app

# Instala dependencias (incluye dev: se necesita el CLI de Nest para compilar).
# Se usa npm install porque el package-lock.json por-app del monorepo está
# desincronizado; el lock real vive en la raíz de los workspaces.
COPY package.json ./
RUN npm install

# Compila el código TypeScript a dist/.
COPY . .
RUN npm run build

# Deja solo las dependencias de producción para copiarlas a la imagen final.
RUN npm prune --omit=dev

# ── Etapa de ejecución ────────────────────────────────────────
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main"]
