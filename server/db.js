import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'megagames.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  console.log(`[DB] Conectado a la base de datos SQLite en: ${dbPath}`);

  // Tablas
  db.exec(`
    CREATE TABLE IF NOT EXISTS regiones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS comunas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      FOREIGN KEY (region_id) REFERENCES regiones(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_completo TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      telefono TEXT,
      rol TEXT NOT NULL DEFAULT 'cliente' CHECK(rol IN ('cliente', 'admin')),
      region_id INTEGER,
      comuna_id INTEGER,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (region_id) REFERENCES regiones(id),
      FOREIGN KEY (comuna_id) REFERENCES comunas(id)
    );

    CREATE TABLE IF NOT EXISTS juegos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      plataforma TEXT NOT NULL, -- Ej: 'nintendo', 'playstation', 'xbox' o 'nintendo,playstation'
      descripcion TEXT,
      precio INTEGER NOT NULL,
      imagen TEXT NOT NULL,
      es_preventa INTEGER DEFAULT 0 CHECK(es_preventa IN (0, 1)),
      fecha_lanzamiento TEXT,
      stock INTEGER DEFAULT 10,
      destacado INTEGER DEFAULT 0,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mensajes_contacto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS carritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      juego_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL DEFAULT 1,
      agregado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      juego_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL DEFAULT 1,
      precio_unitario INTEGER NOT NULL,
      total INTEGER NOT NULL,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (juego_id) REFERENCES juegos(id)
    );

    CREATE TABLE IF NOT EXISTS deseos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      juego_id INTEGER NOT NULL,
      agregado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(usuario_id, juego_id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS solicitudes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'Soporte',
      asunto TEXT NOT NULL,
      detalle TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'Pendiente',
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

  // Asegurar que la columna 'rol' exista si la tabla ya existía
  try {
    const tableInfo = db.prepare("PRAGMA table_info(usuarios)").all();
    const hasRol = tableInfo.some(col => col.name === 'rol');
    if (!hasRol) {
      db.exec("ALTER TABLE usuarios ADD COLUMN rol TEXT NOT NULL DEFAULT 'cliente'");
    }
  } catch (err) {
    console.error("Error verificando columna rol:", err);
  }

  seedData();
}

function seedData() {
  // 1. Regiones y Comunas
  const countRegiones = db.prepare('SELECT COUNT(*) as count FROM regiones').get().count;
  if (countRegiones === 0) {
    const insertRegion = db.prepare('INSERT INTO regiones (nombre) VALUES (?)');
    const insertComuna = db.prepare('INSERT INTO comunas (region_id, nombre) VALUES (?, ?)');

    const datosGeograficos = [
      {
        nombre: 'Región Metropolitana de Santiago',
        comunas: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'Puente Alto', 'San Miguel']
      },
      {
        nombre: 'Valparaíso',
        comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón']
      },
      {
        nombre: 'Biobío',
        comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante', 'Los Ángeles']
      }
    ];

    db.transaction(() => {
      for (const reg of datosGeograficos) {
        const info = insertRegion.run(reg.nombre);
        for (const com of reg.comunas) {
          insertComuna.run(info.lastInsertRowid, com);
        }
      }
    })();
  }

  // 2. Juegos
  const countJuegos = db.prepare('SELECT COUNT(*) as count FROM juegos').get().count;
  if (countJuegos === 0) {
    const insertJuego = db.prepare(`
      INSERT INTO juegos (titulo, plataforma, descripcion, precio, imagen, es_preventa, fecha_lanzamiento, stock, destacado)
      VALUES (@titulo, @plataforma, @descripcion, @precio, @imagen, @es_preventa, @fecha_lanzamiento, @stock, @destacado)
    `);

    const juegosIniciales = [
      {
        titulo: 'The Legend of Zelda: Tears of the Kingdom',
        plataforma: 'nintendo',
        descripcion: 'Aventura épica por Hyrule.',
        precio: 59990,
        imagen: '/img/tloz_totk.jpeg',
        es_preventa: 0,
        fecha_lanzamiento: 'Disponible ya',
        stock: 25,
        destacado: 1
      },
      {
        titulo: 'Super Mario Bros. Wonder',
        plataforma: 'nintendo',
        descripcion: 'Nuevas aventuras y diversión de Mario.',
        precio: 49990,
        imagen: '/img/sm_wonder.jpg',
        es_preventa: 0,
        fecha_lanzamiento: 'Disponible ya',
        stock: 18,
        destacado: 1
      },
      {
        titulo: "Marvel's Wolverine",
        plataforma: 'playstation',
        descripcion: 'Acción visceral de Wolverine en PS5.',
        precio: 69990,
        imagen: '/img/Wolverine.jpg',
        es_preventa: 1,
        fecha_lanzamiento: 'Otoño 2026',
        stock: 50,
        destacado: 1
      },
      {
        titulo: 'Metal Gear Solid Delta: Snake Eater',
        plataforma: 'playstation',
        descripcion: 'Remake con gráficos hiperrealistas.',
        precio: 64990,
        imagen: '/img/MGS.png',
        es_preventa: 0,
        fecha_lanzamiento: 'Disponible ya',
        stock: 14,
        destacado: 1
      },
      {
        titulo: 'Grand Theft Auto VI',
        plataforma: 'xbox',
        descripcion: 'La experiencia de mundo abierto más esperada.',
        precio: 79990,
        imagen: '/img/Gta6.jpg',
        es_preventa: 1,
        fecha_lanzamiento: '2026',
        stock: 100,
        destacado: 1
      },
      {
        titulo: 'Gears of War: E-Day',
        plataforma: 'xbox',
        descripcion: 'El origen de la pesadilla Locust.',
        precio: 69990,
        imagen: '/img/gears_eday.jpg',
        es_preventa: 1,
        fecha_lanzamiento: '2026',
        stock: 60,
        destacado: 1
      }
    ];

    db.transaction(() => {
      for (const j of juegosIniciales) {
        insertJuego.run(j);
      }
    })();
  }

  // 3. Usuarios (Admin y Cliente)
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync('123456', salt);

  // Comprobar si existe admin
  const admin = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin@megagames.cl');
  if (!admin) {
    db.prepare(`
      INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, rol, region_id, comuna_id)
      VALUES (?, ?, ?, ?, 'admin', 1, 1)
    `).run('Administrador MegaGames', 'admin@megagames.cl', hashPass, '+56900000000');
  } else {
    db.prepare("UPDATE usuarios SET rol = 'admin' WHERE email = 'admin@megagames.cl'").run();
  }

  // Comprobar si existe cliente demo
  const demo = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('gamer@megagames.cl');
  if (!demo) {
    db.prepare(`
      INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, rol, region_id, comuna_id)
      VALUES (?, ?, ?, ?, 'cliente', 1, 1)
    `).run('Gamer Demo', 'gamer@megagames.cl', hashPass, '+56912345678');
  }

  // 4. Semilla de Carrito y Ventas de demostración si están vacías
  const countVentas = db.prepare('SELECT COUNT(*) as c FROM ventas').get().c;
  if (countVentas === 0) {
    const demoUser = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('gamer@megagames.cl');
    const primerJuego = db.prepare('SELECT id, precio FROM juegos LIMIT 1').get();
    if (demoUser && primerJuego) {
      db.prepare(`
        INSERT INTO ventas (usuario_id, juego_id, cantidad, precio_unitario, total)
        VALUES (?, ?, 2, ?, ?)
      `).run(demoUser.id, primerJuego.id, primerJuego.precio, primerJuego.precio * 2);

      db.prepare(`
        INSERT INTO carritos (usuario_id, juego_id, cantidad)
        VALUES (?, ?, 1)
      `).run(demoUser.id, primerJuego.id);
    }
  }
}

export default db;
