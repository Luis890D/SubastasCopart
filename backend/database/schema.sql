-- ============================================================
--  SUBASTAS COPART — Script de Base de Datos
--  BD: db_WebDevUMG | Convención: tabla_7145
-- ============================================================

-- 1. Usuarios
CREATE TABLE Usuarios_7145 (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  nombre      VARCHAR(100)  NOT NULL,
  apellido    VARCHAR(100)  NOT NULL,
  correo      VARCHAR(255)  NOT NULL UNIQUE,
  telefono    VARCHAR(20),
  password    VARCHAR(255)  NOT NULL,
  created_at  DATETIME      DEFAULT GETDATE()
);

-- 2. Vehículos (ficha técnica completa)
CREATE TABLE Vehiculos_7145 (
  id              INT IDENTITY(1,1) PRIMARY KEY,
  usuario_id      INT           NOT NULL,
  anio            INT           NOT NULL,
  tipo_articulo   VARCHAR(100),
  marca           VARCHAR(100),
  modelo          VARCHAR(100),
  motor           VARCHAR(100),
  transmision     VARCHAR(50),
  combustible     VARCHAR(50),
  tren_manejo     VARCHAR(10),     -- AWD | FWD | RWD | 4WD
  cilindros       INT,
  nivel_danio     VARCHAR(10)   NOT NULL,   -- verde | amarillo | rojo
  precio_base     DECIMAL(18,2) NOT NULL,
  fecha_inicio    DATETIME      NOT NULL,
  fecha_fin       DATETIME      NOT NULL,
  created_at      DATETIME      DEFAULT GETDATE(),
  CONSTRAINT FK_Veh_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios_7145(id)
);

-- 3. Galería de fotos (mínimo 5 por vehículo)
CREATE TABLE FotosVehiculo_7145 (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  vehiculo_id INT          NOT NULL,
  url         VARCHAR(500) NOT NULL,
  orden       INT          DEFAULT 0,
  CONSTRAINT FK_Foto_Veh FOREIGN KEY (vehiculo_id) REFERENCES Vehiculos_7145(id)
);

-- 4. Pujas
CREATE TABLE Pujas_7145 (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  vehiculo_id INT           NOT NULL,
  usuario_id  INT           NOT NULL,
  monto       DECIMAL(18,2) NOT NULL,
  fecha       DATETIME      DEFAULT GETDATE(),
  CONSTRAINT FK_Puja_Veh    FOREIGN KEY (vehiculo_id) REFERENCES Vehiculos_7145(id),
  CONSTRAINT FK_Puja_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios_7145(id)
);

-- ============================================================
--  DATOS DE PRUEBA — 3 usuarios (contraseñas generadas por seed)
--  Ejecutar seed.js para insertar con hash bcrypt real
-- ============================================================
-- Los hashes aquí son de "Test1234!" con bcrypt rounds=12
-- Regenerar con: node backend/src/config/seed.js

/*
INSERT INTO Usuarios_7145 (nombre, apellido, correo, telefono, password) VALUES
('Carlos',  'Pérez',    'usuario1@test.com', '50212345678', '<hash_bcrypt>'),
('María',   'González', 'usuario2@test.com', '50287654321', '<hash_bcrypt>'),
('Luis',    'Ramírez',  'usuario3@test.com', '50299887766', '<hash_bcrypt>');
*/
