/**
 * seed.js — Inserta usuarios y vehículos de prueba con fotos y pujas en las tablas _7145
 * Ejecutar: node src/config/seed.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const bcrypt     = require('bcryptjs');
const { getPool, sql } = require('./db');

const usuarios = [
  { nombre: 'Carlos',  apellido: 'Pérez',    correo: 'usuario1@test.com', telefono: '50212345678', password: 'Test1234!' },
  { nombre: 'María',   apellido: 'González', correo: 'usuario2@test.com', telefono: '50287654321', password: 'Test1234!' },
  { nombre: 'Luis',    apellido: 'Ramírez',  correo: 'usuario3@test.com', telefono: '50299887766', password: 'Test1234!' },
];

const vehiculosDemo = [
  {
    anio: 2021,
    tipo_articulo: 'Camioneta Pickup',
    marca: 'Toyota',
    modelo: 'Hilux SR5',
    motor: '2.8L D-4D Turbo',
    transmision: 'Automático',
    combustible: 'Diésel',
    tren_manejo: '4WD',
    cilindros: 4,
    nivel_danio: 'verde',
    precio_base: 12000.00,
    diasFin: 2,
    horasFin: 6,
    fotos: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    ],
    pujas: [13000, 14500]
  },
  {
    anio: 2020,
    tipo_articulo: 'Sedán',
    marca: 'Honda',
    modelo: 'Civic Sport',
    motor: '1.5L VTEC Turbo',
    transmision: 'Automático',
    combustible: 'Gasolina',
    tren_manejo: 'FWD',
    cilindros: 4,
    nivel_danio: 'amarillo',
    precio_base: 7500.00,
    diasFin: 0,
    horasFin: 3,
    fotos: [
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80'
    ],
    pujas: [8000, 8800]
  },
  {
    anio: 2022,
    tipo_articulo: 'Pickup Full-Size',
    marca: 'Ford',
    modelo: 'F-150 Lariat',
    motor: '3.5L EcoBoost V6',
    transmision: 'Automático',
    combustible: 'Gasolina',
    tren_manejo: '4WD',
    cilindros: 6,
    nivel_danio: 'verde',
    precio_base: 22000.00,
    diasFin: 4,
    horasFin: 12,
    fotos: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80'
    ],
    pujas: [23500]
  },
  {
    anio: 2019,
    tipo_articulo: 'Deportivo Sedán',
    marca: 'BMW',
    modelo: 'M3 Competition',
    motor: '3.0L Twin-Turbo I6',
    transmision: 'Automático',
    combustible: 'Gasolina',
    tren_manejo: 'RWD',
    cilindros: 6,
    nivel_danio: 'rojo',
    precio_base: 18500.00,
    diasFin: 1,
    horasFin: 1,
    fotos: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
    ],
    pujas: [19500, 21000]
  }
];

async function seed() {
  const pool = await getPool();
  console.log('🌱 Iniciando seed de datos...\n');

  // 1. Usuarios
  const userIds = [];
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.password, 12);

    let userRes = await pool.request()
      .input('correo', sql.VarChar(255), u.correo)
      .query('SELECT id FROM Usuarios_7145 WHERE correo = @correo');

    let userId;
    if (userRes.recordset.length > 0) {
      console.log(`⚠️  Ya existe usuario: ${u.correo}`);
      userId = userRes.recordset[0].id;
    } else {
      const insert = await pool.request()
        .input('nombre',   sql.VarChar(100), u.nombre)
        .input('apellido', sql.VarChar(100), u.apellido)
        .input('correo',   sql.VarChar(255), u.correo)
        .input('telefono', sql.VarChar(20),  u.telefono)
        .input('password', sql.VarChar(255), hash)
        .query(`
          INSERT INTO Usuarios_7145 (nombre, apellido, correo, telefono, password)
          OUTPUT INSERTED.id
          VALUES (@nombre, @apellido, @correo, @telefono, @password)
        `);
      userId = insert.recordset[0].id;
      console.log(`✅ Usuario creado: ${u.correo} / ${u.password}`);
    }
    userIds.push(userId);
  }

  // 2. Vehículos
  const countVeh = await pool.request().query('SELECT COUNT(*) AS total FROM Vehiculos_7145');
  if (countVeh.recordset[0].total === 0) {
    console.log('\n🚗 Insertando vehículos demo...');
    for (let i = 0; i < vehiculosDemo.length; i++) {
      const v = vehiculosDemo[i];
      const ownerId = userIds[i % userIds.length];

      const now = new Date();
      const fechaFin = new Date(now.getTime() + (v.diasFin * 24 * 60 + v.horasFin * 60) * 60 * 1000);

      const insVeh = await pool.request()
        .input('usuario_id',    sql.Int,           ownerId)
        .input('anio',          sql.Int,           v.anio)
        .input('tipo_articulo', sql.VarChar(100),  v.tipo_articulo)
        .input('marca',         sql.VarChar(100),  v.marca)
        .input('modelo',        sql.VarChar(100),  v.modelo)
        .input('motor',         sql.VarChar(100),  v.motor)
        .input('transmision',   sql.VarChar(50),   v.transmision)
        .input('combustible',   sql.VarChar(50),   v.combustible)
        .input('tren_manejo',   sql.VarChar(10),   v.tren_manejo)
        .input('cilindros',     sql.Int,           v.cilindros)
        .input('nivel_danio',   sql.VarChar(10),   v.nivel_danio)
        .input('precio_base',   sql.Decimal(18,2), v.precio_base)
        .input('fecha_inicio',  sql.DateTime,      now)
        .input('fecha_fin',     sql.DateTime,      fechaFin)
        .query(`
          INSERT INTO Vehiculos_7145 (
            usuario_id, anio, tipo_articulo, marca, modelo, motor,
            transmision, combustible, tren_manejo, cilindros,
            nivel_danio, precio_base, fecha_inicio, fecha_fin
          )
          OUTPUT INSERTED.id
          VALUES (
            @usuario_id, @anio, @tipo_articulo, @marca, @modelo, @motor,
            @transmision, @combustible, @tren_manejo, @cilindros,
            @nivel_danio, @precio_base, @fecha_inicio, @fecha_fin
          )
        `);

      const vehiculoId = insVeh.recordset[0].id;
      console.log(`✅ Vehículo creado: ${v.marca} ${v.modelo} (ID: ${vehiculoId})`);

      // Fotos
      for (let ord = 0; ord < v.fotos.length; ord++) {
        await pool.request()
          .input('vehiculo_id', sql.Int, vehiculoId)
          .input('url',         sql.VarChar(500), v.fotos[ord])
          .input('orden',       sql.Int, ord)
          .query(`
            INSERT INTO FotosVehiculo_7145 (vehiculo_id, url, orden)
            VALUES (@vehiculo_id, @url, @orden)
          `);
      }

      // Pujas de prueba
      for (let pIdx = 0; pIdx < v.pujas.length; pIdx++) {
        const bidderId = userIds[(i + pIdx + 1) % userIds.length];
        await pool.request()
          .input('vehiculo_id', sql.Int, vehiculoId)
          .input('usuario_id',  sql.Int, bidderId)
          .input('monto',       sql.Decimal(18,2), v.pujas[pIdx])
          .query(`
            INSERT INTO Pujas_7145 (vehiculo_id, usuario_id, monto)
            VALUES (@vehiculo_id, @usuario_id, @monto)
          `);
      }
    }
  } else {
    console.log(`\nℹ️  Ya existen ${countVeh.recordset[0].total} vehículos en Vehiculos_7145.`);
  }

  console.log('\n🎉 Seed completado exitosamente.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
