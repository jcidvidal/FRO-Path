# ── Etapa de construcción ─────────────────────────────────────
FROM node:24-bookworm-slim AS build
WORKDIR /app

# URL del backend que Vite incrusta en el bundle (build-time).
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Se usa npm install porque el package-lock.json por-app del monorepo está
# desincronizado; el lock real vive en la raíz de los workspaces.
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ── Etapa de ejecución ────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
