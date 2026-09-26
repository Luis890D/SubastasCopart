/**
 * create-tables.js — Crea todas las tablas en db_WebDevUMG
 * Ejecutar: node src/config/create-tables.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { getPool, sql } = require('./db');

async function createTables() {
  const pool = await getPool();
  console.log('🔧 Creando tablas en db_WebDevUMG...\n');

  // 1. Usuarios_7145
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios_7145' AND xtype='U')
    CREATE TABLE Usuarios_7145 (
      id          INT IDENTITY(1,1) PRIMARY KEY,
      nombre      VARCHAR(100)  NOT NULL,
      apellido    VARCHAR(100)  NOT NULL,
      correo      VARCHAR(255)  NOT NULL UNIQUE,
      telefono    VARCHAR(20),
      password    VARCHAR(255)  NOT NULL,
      created_at  DATETIME      DEFAULT GETDATE()
    )
  `);
  console.log('✅ Tabla Usuarios_7145 OK');

  // 2. Vehiculos_7145
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Vehiculos_7145' AND xtype='U')
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
      tren_manejo     VARCHAR(10),
      cilindros       INT,
      nivel_danio     VARCHAR(10)   NOT NULL,
      precio_base     DECIMAL(18,2) NOT NULL,
      fecha_inicio    DATETIME      NOT NULL,
      fecha_fin       DATETIME      NOT NULL,
      created_at      DATETIME      DEFAULT GETDATE(),
      CONSTRAINT FK_Veh_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios_7145(id)
    )
  `);
  console.log('✅ Tabla Vehiculos_7145 OK');

  // 3. FotosVehiculo_7145
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FotosVehiculo_7145' AND xtype='U')
    CREATE TABLE FotosVehiculo_7145 (
      id          INT IDENTITY(1,1) PRIMARY KEY,
      vehiculo_id INT          NOT NULL,
      url         VARCHAR(500) NOT NULL,
      orden       INT          DEFAULT 0,
      CONSTRAINT FK_Foto_Veh FOREIGN KEY (vehiculo_id) REFERENCES Vehiculos_7145(id)
    )
  `);
  console.log('✅ Tabla FotosVehiculo_7145 OK');

  // 4. Pujas_7145
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pujas_7145' AND xtype='U')
    CREATE TABLE Pujas_7145 (
      id          INT IDENTITY(1,1) PRIMARY KEY,
      vehiculo_id INT           NOT NULL,
      usuario_id  INT           NOT NULL,
      monto       DECIMAL(18,2) NOT NULL,
      fecha       DATETIME      DEFAULT GETDATE(),
      CONSTRAINT FK_Puja_Veh     FOREIGN KEY (vehiculo_id) REFERENCES Vehiculos_7145(id),
      CONSTRAINT FK_Puja_Usuario FOREIGN KEY (usuario_id)  REFERENCES Usuarios_7145(id)
    )
  `);
  console.log('✅ Tabla Pujas_7145 OK');

  console.log('\n🎉 Todas las tablas creadas correctamente.');
  process.exit(0);
}

createTables().catch((err) => {
  console.error('❌ Error al crear tablas:', err.message);
  process.exit(1);
});
