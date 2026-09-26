# ---- Backend ----
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# ---- Frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=backend /app/backend ./backend
COPY --from=frontend-build /app/frontend/dist ./backend/public
WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "src/server.js"]
