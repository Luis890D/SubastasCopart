/**
 * seed.js — Inserta 3 usuarios de prueba en Usuarios_7145
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

async function seed() {
  const pool = await getPool();
  console.log('🌱 Iniciando seed de usuarios...\n');

  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.password, 12);

    // Verificar si ya existe
    const exists = await pool.request()
      .input('correo', sql.VarChar(255), u.correo)
      .query('SELECT id FROM Usuarios_7145 WHERE correo = @correo');

    if (exists.recordset.length > 0) {
      console.log(`⚠️  Ya existe: ${u.correo}`);
      continue;
    }

    await pool.request()
      .input('nombre',   sql.VarChar(100), u.nombre)
      .input('apellido', sql.VarChar(100), u.apellido)
      .input('correo',   sql.VarChar(255), u.correo)
      .input('telefono', sql.VarChar(20),  u.telefono)
      .input('password', sql.VarChar(255), hash)
      .query(`
        INSERT INTO Usuarios_7145 (nombre, apellido, correo, telefono, password)
        VALUES (@nombre, @apellido, @correo, @telefono, @password)
      `);

    console.log(`✅ Insertado: ${u.correo} / ${u.password}`);
  }

  console.log('\n✅ Seed completado.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
