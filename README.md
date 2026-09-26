# 🚗 Subastas Copart — Plataforma en Tiempo Real

Plataforma Web desacoplada para la subasta de vehículos importados en tiempo real (estilo Copart) desarrollada con arquitectura **MVC**, **Node.js + Express** en el backend con **Socket.io**, base de datos **SQL Server en Azure** con nomenclatura `_7145`, y **Vite + React** en el frontend.

---

## 🌐 Enlaces de Despliegue en la Web
- **Frontend (Vercel)**: `[Ingresa tu URL de Vercel aquí]`
- **Backend (Render / API)**: `[Ingresa tu URL de Render aquí]`

---

## 👥 Credenciales de Prueba (Para Evaluación del Catedrático)
Para realizar pruebas cruzadas de subastas en tiempo real entre múltiples navegadores/pestañas:

| # | Nombre | Correo Electrónico | Contraseña |
|---|---|---|---|
| 1 | Carlos Pérez | `usuario1@test.com` | `Test1234!` |
| 2 | María González | `usuario2@test.com` | `Test1234!` |
| 3 | Luis Ramírez | `usuario3@test.com` | `Test1234!` |

---

## 🗄️ Base de Datos (`_7145`) en Azure SQL Server
- **Servidor**: `svr-sql-ctezo.southcentralus.cloudapp.azure.com`
- **Base de Datos**: `db_WebDevUMG`
- **Tablas Creadas**:
  - `Usuarios_7145`
  - `Vehiculos_7145`
  - `FotosVehiculo_7145`
  - `Pujas_7145`

---

## 🚀 Despliegue en la Nube

### 1. Frontend en Vercel
1. Conecta el repositorio `Luis890D/SubastasCopart` en [Vercel](https://vercel.com).
2. Configura **Root Directory** como: `frontend`.
3. Framework Preset: **Vite**.
4. Variable de entorno:
   - `VITE_API_URL`: URL de tu backend en Render (ej: `https://subastas-copart-backend.onrender.com/api`).
5. El archivo [frontend/vercel.json](file:///d:/U%202024%20DAVID/U%20David%202026/Octavo%20Semestre/DESARROLLO%20WEB/Parcial%20II/Subastas_Copart/frontend/vercel.json) se encarga de reescribir las rutas SPA de React Router.

### 2. Backend en Render (Node.js con WebSockets/Socket.io)
1. Conecta el repositorio en [Render.com](https://render.com).
2. Puedes usar el Blueprint [render.yaml](file:///d:/U%202024%20DAVID/U%20David%202026/Octavo%20Semestre/DESARROLLO%20WEB/Parcial%20II/Subastas_Copart/render.yaml) o crear un **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
3. Variables de entorno en Render:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `DB_USER`: `UsuarioEncuestas`
   - `DB_PASSWORD`: `DesaWeb2025$!`
   - `DB_SERVER`: `svr-sql-ctezo.southcentralus.cloudapp.azure.com`
   - `DB_DATABASE`: `db_WebDevUMG`
   - `DB_PORT`: `1433`
   - `DB_ENCRYPT`: `true`
   - `DB_TRUST_SERVER_CERT`: `true`
   - `JWT_SECRET`: `subastas_copart_jwt_secret_2025`
   - `JWT_EXPIRES_IN`: `24h`
   - `CORS_ORIGIN`: `*`

---

## 💻 Ejecución Local

### Backend
```bash
cd backend
npm install
npm run seed       # Carga usuarios y vehículos de prueba
npm run dev        # http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

---

## 🎯 Características Principales
- 🔴 **Subastas en Tiempo Real (Socket.io)**: Actualización instantánea de ofertas, indicadores y reloj temporizador sin recargar pantalla (F5 prohibido).
- 🏷️ **Apartado Mis Pujas**: Panel completo para postores con estado dinámico (*Vas ganando*, *Superado*, *Subasta ganada*).
- 🔍 **Filtrado Avanzado**: Búsqueda libre escrita + selección por lista (marca, modelo, año, combustible, nivel de daño y tracción).
- 🟢🟡🔴 **Clasificación por Daño**: Verde (Menor), Amarillo (Medio), Rojo (Severo).
- 📷 **Galería y Carrusel**: Carrusel interactivo con 5+ imágenes por vehículo y manejo de fallbacks.
- 🔒 **Seguridad y Privacidad**: Autenticación JWT, contraseñas con bcrypt (cost 12), postores anónimos en el historial de pujas.
