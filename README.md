# 🚗 Subastas Copart

Sistema de subastas de vehículos desarrollado con arquitectura **MVC** usando **Node.js + Express** en el backend y **Vite + React** en el frontend.

---

## 📁 Estructura del Proyecto

```
Subastas_Copart/
├── backend/                        # API REST - Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Conexión SQL Server (mssql)
│   │   ├── controllers/            # 🎮 Controladores (lógica de negocio)
│   │   │   ├── auth.controller.js
│   │   │   ├── subasta.controller.js
│   │   │   ├── puja.controller.js
│   │   │   └── usuario.controller.js
│   │   ├── middlewares/            # 🛡️ Middlewares
│   │   │   ├── auth.middleware.js  # JWT validation
│   │   │   ├── error.middleware.js # Error handler global
│   │   │   └── validate.middleware.js
│   │   ├── models/                 # 📦 Modelos (acceso a datos - SQL Server)
│   │   │   ├── usuario.model.js
│   │   │   ├── subasta.model.js
│   │   │   └── puja.model.js
│   │   ├── routes/                 # 🔀 Rutas de la API
│   │   │   ├── auth.routes.js
│   │   │   ├── subasta.routes.js
│   │   │   ├── puja.routes.js
│   │   │   └── usuario.routes.js
│   │   ├── app.js                  # Configuración Express
│   │   └── server.js               # Punto de entrada
│   ├── .env                        # Variables de entorno
│   └── package.json
│
├── frontend/                       # UI - Vite + React
│   ├── src/
│   │   ├── components/             # 🧩 Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/                # 🌐 Estado global (React Context)
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/                  # 🪝 Custom Hooks
│   │   │   ├── useApi.js
│   │   │   └── useAuthForm.js
│   │   ├── pages/                  # 📄 Páginas / Vistas
│   │   │   ├── HomePage.jsx
│   │   │   ├── SubastasPage.jsx
│   │   │   ├── SubastaDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/               # 🔌 Servicios (llamadas a la API)
│   │   │   ├── api.js              # Cliente HTTP base (fetch)
│   │   │   ├── auth.service.js
│   │   │   └── subasta.service.js
│   │   ├── App.jsx                 # Router principal
│   │   └── main.jsx
│   └── .env
│
├── docker-compose.yml              # Docker: backend + frontend
├── Dockerfile
└── README.md
```

---

## 🚀 Cómo levantar el proyecto

### Opción 1: Local (sin Docker)

**Backend**
```bash
cd backend
npm install
npm run dev          # http://localhost:3000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Opción 2: Docker Compose

```bash
docker-compose up --build
```

---

## 🔑 Variables de entorno

### Backend (`backend/.env`)
| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default: 3000) |
| `DB_SERVER` | Host SQL Server Azure |
| `DB_USER` | Usuario SQL Server |
| `DB_PASSWORD` | Contraseña SQL Server |
| `DB_DATABASE` | Nombre de la base de datos |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `CORS_ORIGIN` | Origen permitido para CORS |

### Frontend (`frontend/.env`)
| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API (`http://localhost:3000/api`) |

---

## 🌐 Endpoints de la API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Registro de usuario |
| POST | `/api/auth/login` | ❌ | Login (devuelve JWT) |
| GET | `/api/subastas` | ❌ | Lista de subastas |
| GET | `/api/subastas/:id` | ❌ | Detalle de subasta |
| POST | `/api/subastas` | ✅ | Crear subasta |
| PUT | `/api/subastas/:id` | ✅ | Actualizar subasta |
| DELETE | `/api/subastas/:id` | ✅ | Eliminar subasta |
| GET | `/api/subastas/:id/pujas` | ❌ | Pujas de una subasta |
| POST | `/api/subastas/:id/pujas` | ✅ | Realizar puja |
| GET | `/api/usuarios` | ✅ | Lista de usuarios |
| PUT | `/api/usuarios/:id` | ✅ | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | ✅ | Eliminar usuario |
| GET | `/api/health` | ❌ | Health check |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Node.js, Express.js |
| Base de datos | SQL Server (Azure) |
| ORM/Driver | mssql |
| Autenticación | JWT + bcryptjs |
| Frontend | Vite, React, React Router |
| Contenedores | Docker, Docker Compose |
