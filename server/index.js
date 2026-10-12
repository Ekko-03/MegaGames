import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db, { initDatabase } from './db.js';

initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Salud / Estadísticas generales
app.get('/api/health', (req, res) => {
  try {
    const stats = {
      juegos: db.prepare('SELECT COUNT(*) as c FROM juegos').get().c,
      usuarios: db.prepare('SELECT COUNT(*) as c FROM usuarios').get().c,
      regiones: db.prepare('SELECT COUNT(*) as c FROM regiones').get().c,
      mensajes: db.prepare('SELECT COUNT(*) as c FROM mensajes_contacto').get().c,
    };
    res.json({ status: 'ok', fecha: new Date().toISOString(), estadisticas: stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// VIDEOJUEGOS
// ==========================================

app.get('/api/juegos', (req, res) => {
  try {
    const { plataforma, preventa, q } = req.query;
    let query = 'SELECT * FROM juegos WHERE 1=1';
    const params = [];

    if (plataforma) {
      query += ' AND (plataforma = ? OR plataforma LIKE ? OR plataforma LIKE ? OR plataforma LIKE ?)';
      const p = plataforma.toLowerCase().trim();
      params.push(p, `${p},%`, `%,${p}`, `%,${p},%`);
    }

    if (preventa !== undefined) {
      query += ' AND es_preventa = ?';
      params.push(preventa === 'true' || preventa === '1' ? 1 : 0);
    }

    if (q) {
      query += ' AND (titulo LIKE ? OR descripcion LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    query += ' ORDER BY id DESC';
    const juegos = db.prepare(query).all(...params);
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/juegos', (req, res) => {
  try {
    const { titulo, plataforma, descripcion, precio, imagen, es_preventa, fecha_lanzamiento, stock } = req.body;
    if (!titulo || !plataforma || !precio) {
      return res.status(400).json({ error: 'Título, plataforma y precio son requeridos' });
    }

    const stmt = db.prepare(`
      INSERT INTO juegos (titulo, plataforma, descripcion, precio, imagen, es_preventa, fecha_lanzamiento, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      titulo.trim(),
      plataforma.toLowerCase().trim(),
      descripcion || '',
      Number(precio),
      imagen || '/img/logo.png',
      es_preventa ? 1 : 0,
      fecha_lanzamiento || 'Disponible ya',
      stock ? Number(stock) : 10
    );

    const nuevoJuego = db.prepare('SELECT * FROM juegos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, juego: nuevoJuego });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar juego existente (Admin)
app.put('/api/juegos/:id', (req, res) => {
  try {
    const { titulo, plataforma, descripcion, precio, imagen, es_preventa, fecha_lanzamiento, stock } = req.body;
    if (!titulo || !plataforma || !precio) {
      return res.status(400).json({ error: 'Título, plataforma y precio son requeridos' });
    }

    const stmt = db.prepare(`
      UPDATE juegos SET
        titulo = ?,
        plataforma = ?,
        descripcion = ?,
        precio = ?,
        imagen = ?,
        es_preventa = ?,
        fecha_lanzamiento = ?,
        stock = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      titulo.trim(),
      plataforma.toLowerCase().trim(),
      descripcion || '',
      Number(precio),
      imagen || '/img/logo.png',
      es_preventa ? 1 : 0,
      fecha_lanzamiento || 'Disponible ya',
      stock ? Number(stock) : 10,
      req.params.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    const juegoActualizado = db.prepare('SELECT * FROM juegos WHERE id = ?').get(req.params.id);
    res.json({ success: true, juego: juegoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar juego (Admin)
app.delete('/api/juegos/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM juegos WHERE id = ?').run(req.params.id);
    res.json({ success: true, mensaje: 'Juego eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// REGIONES Y COMUNAS
// ==========================================

app.get('/api/regiones', (req, res) => {
  try {
    const regiones = db.prepare('SELECT * FROM regiones ORDER BY id ASC').all();
    res.json(regiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/comunas/:regionId', (req, res) => {
  try {
    const comunas = db.prepare('SELECT * FROM comunas WHERE region_id = ? ORDER BY nombre ASC').all(req.params.regionId);
    res.json(comunas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// AUTENTICACIÓN Y USUARIOS
// ==========================================

app.post('/api/auth/registro', (req, res) => {
  try {
    const { nombre_completo, email, password, telefono, region, comuna } = req.body;

    if (!nombre_completo || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }

    const existente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email.trim());
    if (existente) {
      return res.status(400).json({ error: 'Ya existe una cuenta registrada con este correo electrónico' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const stmt = db.prepare(`
      INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, rol, region_id, comuna_id)
      VALUES (?, ?, ?, ?, 'cliente', ?, ?)
    `);

    const result = stmt.run(
      nombre_completo.trim(),
      email.trim(),
      password_hash,
      telefono ? telefono.trim() : null,
      region ? Number(region) : null,
      comuna ? Number(comuna) : null
    );

    const nuevoUsuario = db.prepare(`
      SELECT u.id, u.nombre_completo, u.email, u.rol, u.telefono, r.nombre as region, c.nombre as comuna, u.creado_en
      FROM usuarios u
      LEFT JOIN regiones r ON u.region_id = r.id
      LEFT JOIN comunas c ON u.comuna_id = c.id
      WHERE u.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      mensaje: '¡Usuario registrado exitosamente!',
      usuario: nuevoUsuario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const usuario = db.prepare(`
      SELECT u.*, r.nombre as region_nombre, c.nombre as comuna_nombre
      FROM usuarios u
      LEFT JOIN regiones r ON u.region_id = r.id
      LEFT JOIN comunas c ON u.comuna_id = c.id
      WHERE u.email = ?
    `).get(email.trim());

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas. Correo no encontrado' });
    }

    const match = bcrypt.compareSync(password, usuario.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas. Contraseña incorrecta' });
    }

    const { password_hash, ...datosSeguros } = usuario;
    res.json({
      success: true,
      mensaje: 'Inicio de sesión correcto',
      usuario: datosSeguros
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// PANEL DE ADMINISTRADOR
// ==========================================

// Obtener lista completa de usuarios (Admin)
app.get('/api/admin/usuarios', (req, res) => {
  try {
    const usuarios = db.prepare(`
      SELECT u.id, u.nombre_completo, u.email, u.rol, u.telefono, u.creado_en,
             r.nombre as region, c.nombre as comuna
      FROM usuarios u
      LEFT JOIN regiones r ON u.region_id = r.id
      LEFT JOIN comunas c ON u.comuna_id = c.id
      ORDER BY u.id DESC
    `).all();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Métricas de ventas y carritos (Admin)
app.get('/api/admin/metricas', (req, res) => {
  try {
    const totalVendidos = db.prepare('SELECT COALESCE(SUM(cantidad), 0) as total FROM ventas').get().total;
    const ingresosTotales = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM ventas').get().total;
    const totalEnCarritos = db.prepare('SELECT COALESCE(SUM(cantidad), 0) as total FROM carritos').get().total;
    const usuariosTotales = db.prepare('SELECT COUNT(*) as total FROM usuarios').get().total;
    const juegosTotales = db.prepare('SELECT COUNT(*) as total FROM juegos').get().total;

    // Desglose de productos en carrito actualmente
    const detalleCarritos = db.prepare(`
      SELECT c.id, c.cantidad, c.agregado_en, u.nombre_completo as usuario, u.email, j.titulo as juego, j.precio
      FROM carritos c
      JOIN usuarios u ON c.usuario_id = u.id
      JOIN juegos j ON c.juego_id = j.id
      ORDER BY c.id DESC
      LIMIT 20
    `).all();

    // Desglose de ventas recientes
    const ventasRecientes = db.prepare(`
      SELECT v.id, v.cantidad, v.precio_unitario, v.total, v.creado_en,
             COALESCE(u.nombre_completo, 'Cliente invitado') as usuario, j.titulo as juego
      FROM ventas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      JOIN juegos j ON v.juego_id = j.id
      ORDER BY v.id DESC
      LIMIT 20
    `).all();

    res.json({
      resumen: {
        totalVendidos,
        ingresosTotales,
        totalEnCarritos,
        usuariosTotales,
        juegosTotales
      },
      detalleCarritos,
      ventasRecientes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar todas las solicitudes para el administrador
app.get('/api/admin/solicitudes', (req, res) => {
  try {
    const solicitudes = db.prepare(`
      SELECT s.id, 'Interna' as origen, s.tipo, s.asunto, s.detalle, s.estado, s.creado_en,
             u.nombre_completo as usuario_nombre, u.email as usuario_email
      FROM solicitudes s
      LEFT JOIN usuarios u ON s.usuario_id = u.id
      UNION ALL
      SELECT m.id, 'Contacto Web' as origen, 'Mensaje' as tipo, 'Contacto General' as asunto, m.mensaje as detalle, 'Recibido' as estado, m.creado_en,
             m.nombre as usuario_nombre, m.email as usuario_email
      FROM mensajes_contacto m
      ORDER BY creado_en DESC
    `).all();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cambiar estado de una solicitud (Admin)
app.put('/api/admin/solicitudes/:id', (req, res) => {
  try {
    const { estado } = req.body;
    db.prepare('UPDATE solicitudes SET estado = ? WHERE id = ?').run(estado, req.params.id);
    res.json({ success: true, mensaje: 'Estado de solicitud actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Acción de simular compra o añadir al carrito
app.post('/api/carrito', (req, res) => {
  try {
    const { usuario_id, juego_id, cantidad = 1 } = req.body;
    if (!usuario_id || !juego_id) {
      return res.status(400).json({ error: 'usuario_id y juego_id requeridos' });
    }

    const itemExistente = db.prepare('SELECT id, cantidad FROM carritos WHERE usuario_id = ? AND juego_id = ?').get(usuario_id, juego_id);
    if (itemExistente) {
      db.prepare('UPDATE carritos SET cantidad = cantidad + ? WHERE id = ?').run(cantidad, itemExistente.id);
    } else {
      db.prepare('INSERT INTO carritos (usuario_id, juego_id, cantidad) VALUES (?, ?, ?)').run(usuario_id, juego_id, cantidad);
    }

    res.json({ success: true, mensaje: 'Producto añadido al carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simular checkout / compra realizada
app.post('/api/comprar', (req, res) => {
  try {
    const { usuario_id, juego_id, cantidad = 1 } = req.body;
    const juego = db.prepare('SELECT id, precio, stock FROM juegos WHERE id = ?').get(juego_id);
    if (!juego) return res.status(404).json({ error: 'Juego no encontrado' });

    const total = juego.precio * cantidad;
    db.prepare('INSERT INTO ventas (usuario_id, juego_id, cantidad, precio_unitario, total) VALUES (?, ?, ?, ?, ?)').run(usuario_id || null, juego_id, cantidad, juego.precio, total);

    // Si estaba en carrito, remover
    if (usuario_id) {
      db.prepare('DELETE FROM carritos WHERE usuario_id = ? AND juego_id = ?').run(usuario_id, juego_id);
    }

    res.json({ success: true, mensaje: 'Compra procesada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CARRITO Y COMPRAS
// ==========================================

// Agregar o incrementar producto en el carrito
app.post('/api/carrito', (req, res) => {
  try {
    const { usuario_id, juego_id, cantidad = 1 } = req.body;
    if (!usuario_id || !juego_id) {
      return res.status(400).json({ error: 'Falta usuario_id o juego_id' });
    }

    const uid = Number(usuario_id);
    const jid = Number(juego_id);

    const existe = db.prepare('SELECT id, cantidad FROM carritos WHERE usuario_id = ? AND juego_id = ?').get(uid, jid);

    if (existe) {
      db.prepare('UPDATE carritos SET cantidad = cantidad + ? WHERE id = ?').run(Number(cantidad), existe.id);
    } else {
      db.prepare('INSERT INTO carritos (usuario_id, juego_id, cantidad) VALUES (?, ?, ?)').run(uid, jid, Number(cantidad));
    }

    res.json({ success: true, mensaje: 'Producto guardado en el carrito' });
  } catch (error) {
    console.error("Error en POST /api/carrito:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito de un usuario
app.get('/api/carrito/:usuario_id', (req, res) => {
  try {
    const uid = Number(req.params.usuario_id);
    const carrito = db.prepare(`
      SELECT c.id as carrito_id, c.cantidad, c.agregado_en,
             j.id as juego_id, j.titulo, j.precio, j.imagen, j.plataforma
      FROM carritos c
      JOIN juegos j ON c.juego_id = j.id
      WHERE c.usuario_id = ?
    `).all(uid);

    res.json(carrito);
  } catch (error) {
    console.error("Error en GET /api/carrito:", error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto del carrito
app.delete('/api/carrito/:carrito_id', (req, res) => {
  try {
    db.prepare('DELETE FROM carritos WHERE id = ?').run(req.params.carrito_id);
    res.json({ success: true, mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comprar todo el carrito
app.post('/api/comprar-carrito', (req, res) => {
  try {
    const { usuario_id } = req.body;
    const uid = Number(usuario_id);

    const items = db.prepare('SELECT juego_id, cantidad FROM carritos WHERE usuario_id = ?').all(uid);
    if (items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const insertVenta = db.prepare('INSERT INTO ventas (usuario_id, juego_id, cantidad, precio_unitario, total) VALUES (?, ?, ?, ?, ?)');
    const getPrecio = db.prepare('SELECT precio FROM juegos WHERE id = ?');

    db.transaction(() => {
      for (const item of items) {
        const juego = getPrecio.get(item.juego_id);
        if (juego) {
          const total = juego.precio * item.cantidad;
          insertVenta.run(uid, item.juego_id, item.cantidad, juego.precio, total);
        }
      }
      db.prepare('DELETE FROM carritos WHERE usuario_id = ?').run(uid);
    })();

    res.json({ success: true, mensaje: '¡Compra exitosa! Revisa "Mis Compras"' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compra directa (1 solo producto)
app.post('/api/comprar', (req, res) => {
  try {
    const { usuario_id, juego_id, cantidad = 1 } = req.body;
    const jid = Number(juego_id);
    const uid = usuario_id ? Number(usuario_id) : null;

    const juego = db.prepare('SELECT id, precio, stock FROM juegos WHERE id = ?').get(jid);
    if (!juego) return res.status(404).json({ error: 'Juego no encontrado' });

    const total = juego.precio * Number(cantidad);
    db.prepare('INSERT INTO ventas (usuario_id, juego_id, cantidad, precio_unitario, total) VALUES (?, ?, ?, ?, ?)').run(uid, jid, Number(cantidad), juego.precio, total);

    if (uid) {
      db.prepare('DELETE FROM carritos WHERE usuario_id = ? AND juego_id = ?').run(uid, jid);
    }

    res.json({ success: true, mensaje: 'Compra procesada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// PESTAÑA USUARIO CLIENTE (PERFIL, COMPRAS, DESEOS, SOLICITUDES)
// ==========================================

// Obtener perfil completo y actualizado
app.get('/api/usuario/perfil/:id', (req, res) => {
  try {
    const usuario = db.prepare(`
      SELECT u.id, u.nombre_completo, u.email, u.telefono, u.rol, u.region_id, u.comuna_id,
             r.nombre as region, c.nombre as comuna, u.creado_en
      FROM usuarios u
      LEFT JOIN regiones r ON u.region_id = r.id
      LEFT JOIN comunas c ON u.comuna_id = c.id
      WHERE u.id = ?
    `).get(req.params.id);

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar datos personales
app.put('/api/usuario/perfil/:id', (req, res) => {
  try {
    const { nombre_completo, telefono, region_id, comuna_id, password } = req.body;
    if (!nombre_completo) return res.status(400).json({ error: 'Nombre es requerido' });

    if (password && password.trim().length >= 6) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      db.prepare(`
        UPDATE usuarios SET
          nombre_completo = ?,
          telefono = ?,
          region_id = ?,
          comuna_id = ?,
          password_hash = ?
        WHERE id = ?
      `).run(nombre_completo.trim(), telefono || null, region_id ? Number(region_id) : null, comuna_id ? Number(comuna_id) : null, hash, req.params.id);
    } else {
      db.prepare(`
        UPDATE usuarios SET
          nombre_completo = ?,
          telefono = ?,
          region_id = ?,
          comuna_id = ?
        WHERE id = ?
      `).run(nombre_completo.trim(), telefono || null, region_id ? Number(region_id) : null, comuna_id ? Number(comuna_id) : null, req.params.id);
    }

    const actualizado = db.prepare(`
      SELECT u.id, u.nombre_completo, u.email, u.telefono, u.rol, u.region_id, u.comuna_id,
             r.nombre as region, c.nombre as comuna, u.creado_en
      FROM usuarios u
      LEFT JOIN regiones r ON u.region_id = r.id
      LEFT JOIN comunas c ON u.comuna_id = c.id
      WHERE u.id = ?
    `).get(req.params.id);

    res.json({ success: true, usuario: actualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mis compras
app.get('/api/usuario/compras/:id', (req, res) => {
  try {
    const compras = db.prepare(`
      SELECT v.id, v.cantidad, v.precio_unitario, v.total, v.creado_en,
             j.titulo, j.imagen, j.plataforma
      FROM ventas v
      JOIN juegos j ON v.juego_id = j.id
      WHERE v.usuario_id = ?
      ORDER BY v.id DESC
    `).all(req.params.id);
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lista de deseos - obtener
app.get('/api/usuario/deseos/:id', (req, res) => {
  try {
    const deseos = db.prepare(`
      SELECT d.id as deseo_id, d.agregado_en,
             j.id as juego_id, j.titulo, j.imagen, j.plataforma, j.precio, j.stock, j.es_preventa
      FROM deseos d
      JOIN juegos j ON d.juego_id = j.id
      WHERE d.usuario_id = ?
      ORDER BY d.id DESC
    `).all(req.params.id);
    res.json(deseos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lista de deseos - agregar
app.post('/api/usuario/deseos', (req, res) => {
  try {
    const { usuario_id, juego_id } = req.body;
    if (!usuario_id || !juego_id) return res.status(400).json({ error: 'usuario_id y juego_id requeridos' });

    db.prepare('INSERT OR IGNORE INTO deseos (usuario_id, juego_id) VALUES (?, ?)').run(usuario_id, juego_id);
    res.json({ success: true, mensaje: 'Juego agregado a tu lista de deseos' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lista de deseos - eliminar
app.delete('/api/usuario/deseos/:deseoId', (req, res) => {
  try {
    db.prepare('DELETE FROM deseos WHERE id = ?').run(req.params.deseoId);
    res.json({ success: true, mensaje: 'Juego eliminado de tu lista de deseos' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mis solicitudes - obtener (incluyendo las ingresadas por formulario de contacto)
app.get('/api/usuario/solicitudes/:id', (req, res) => {
  try {
    const usuario = db.prepare('SELECT email FROM usuarios WHERE id = ?').get(req.params.id);
    const emailUsuario = usuario ? usuario.email : '';

    const solicitudes = db.prepare(`
      SELECT id, 'Solicitud Interna' as origen, tipo, asunto, detalle, estado, creado_en
      FROM solicitudes
      WHERE usuario_id = ?
      UNION ALL
      SELECT id, 'Formulario de Contacto' as origen, 'Mensaje Web' as tipo, 'Contacto General' as asunto, mensaje as detalle, 'Recibido' as estado, creado_en
      FROM mensajes_contacto
      WHERE LOWER(email) = LOWER(?)
      ORDER BY creado_en DESC
    `).all(req.params.id, emailUsuario);

    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mis solicitudes - crear nueva
app.post('/api/usuario/solicitudes', (req, res) => {
  try {
    const { usuario_id, tipo, asunto, detalle } = req.body;
    if (!usuario_id || !asunto || !detalle) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const result = db.prepare(`
      INSERT INTO solicitudes (usuario_id, tipo, asunto, detalle, estado)
      VALUES (?, ?, ?, ?, 'En Revisión')
    `).run(usuario_id, tipo || 'Soporte', asunto.trim(), detalle.trim());

    const nueva = db.prepare('SELECT * FROM solicitudes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, solicitud: nueva });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONTACTO
// ==========================================
app.post('/api/contacto', (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const stmt = db.prepare('INSERT INTO mensajes_contacto (nombre, email, mensaje) VALUES (?, ?, ?)');
    const result = stmt.run(nombre.trim(), email.trim(), mensaje.trim());

    // Si el correo coincide con un usuario registrado, vincular también a solicitudes
    const usuario = db.prepare('SELECT id FROM usuarios WHERE LOWER(email) = LOWER(?)').get(email.trim());
    if (usuario) {
      db.prepare(`
        INSERT INTO solicitudes (usuario_id, tipo, asunto, detalle, estado)
        VALUES (?, 'Formulario Web', 'Mensaje de Contacto', ?, 'Recibido')
      `).run(usuario.id, mensaje.trim());
    }

    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Servidor] MegaGames API escuchando en http://localhost:${PORT}`);
});
