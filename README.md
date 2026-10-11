# MegaGames - Plataforma Web con Node.js y SQLite

Sitio web de comercio y catálogo de videojuegos desarrollado con **React**, **Vite**, **Node.js (Express)** y base de datos relacional **SQLite**.

---

## 🗄️ Base de Datos SQLite

La base de datos se almacena localmente en el archivo:
```
server/data/megagames.db
```

### Tablas configuradas:
1. **`usuarios`**: Almacena usuarios registrados con contraseñas encriptadas con `bcryptjs`, región, comuna y datos de contacto.
2. **`juegos`**: Catálogo completo clasificado por plataformas (`nintendo`, `playstation`, `xbox`), precios en CLP, stock, imágenes y estado de preventa.
3. **`regiones`**: Regiones geográficas de Chile.
4. **`comunas`**: Comunas asociadas a cada región con llaves foráneas (`FOREIGN KEY`).
5. **`mensajes_contacto`**: Mensajes y consultas enviados a través del formulario de contacto.

---

## 🚀 Cómo ejecutar el proyecto

### 1. Iniciar Frontend y Backend al mismo tiempo (Recomendado):
```bash
npm run dev
```
Este comando ejecuta concurrentemente:
- El servidor Node.js API en `http://localhost:3001`
- La aplicación cliente Vite en `http://localhost:5173` (con proxy `/api` automático)

### 2. Ejecutar individualmente:
- **Solo Backend Node.js con SQLite:**
  ```bash
  npm run server
  ```
- **Solo Frontend Vite:**
  ```bash
  npm run dev:client
  ```

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Estado del servidor y conteo de registros en SQLite |
| `GET` | `/api/juegos` | Catálogo de juegos (soporta filtros `?plataforma=...`, `?preventa=1`, `?q=...`) |
| `GET` | `/api/juegos/:id` | Obtener detalle de un videojuego específico |
| `POST` | `/api/juegos` | Agregar un nuevo videojuego |
| `GET` | `/api/regiones` | Listado de regiones |
| `GET` | `/api/comunas/:regionId` | Listado de comunas por región |
| `POST` | `/api/auth/registro` | Registro de nuevo usuario (encriptado con bcrypt) |
| `POST` | `/api/auth/login` | Autenticación de usuario |
| `POST` | `/api/contacto` | Guardar mensaje de contacto en la base de datos |
| `GET` | `/api/contacto` | Listar mensajes recibidos |

---

## 👤 Usuario de Demostración Inicial (Seed)

La base de datos viene precargada con un usuario para pruebas inmediatas:
- **Email:** `gamer@megagames.cl`
- **Contraseña:** `123456`
