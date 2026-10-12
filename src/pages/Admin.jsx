import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [metricas, setMetricas] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Control de edición: id del juego seleccionado o null si es nuevo
  const [editandoId, setEditandoId] = useState(null);

  const formInicial = {
    titulo: '',
    plataformas: ['nintendo'],
    descripcion: '',
    precio: '',
    imagen: '/img/logo.png',
    es_preventa: 0,
    fecha_lanzamiento: 'Disponible ya',
    stock: 10
  };

  const [formJuego, setFormJuego] = useState(formInicial);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resMetricas, resUsuarios, resJuegos, resSolicitudes] = await Promise.all([
        fetch('/api/admin/metricas').then(r => r.json()),
        fetch('/api/admin/usuarios').then(r => r.json()),
        fetch('/api/juegos').then(r => r.json()),
        fetch('/api/admin/solicitudes').then(r => r.json())
      ]);

      setMetricas(resMetricas);
      setUsuarios(resUsuarios);
      setJuegos(resJuegos);
      setSolicitudes(resSolicitudes);
    } catch (err) {
      console.error(err);
      setMensaje({ texto: 'Error al conectar con el servidor', tipo: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem('megagames_user');
    if (!raw) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(raw);
    if (user.rol !== 'admin') {
      alert('Acceso restringido solo para administradores');
      navigate('/');
      return;
    }

    cargarDatos();
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormJuego({ ...formJuego, [e.target.name]: value });
  };

  const handlePlataformaToggle = (plat) => {
    setFormJuego(prev => {
      const existe = prev.plataformas.includes(plat);
      let nuevas;
      if (existe) {
        nuevas = prev.plataformas.filter(p => p !== plat);
      } else {
        nuevas = [...prev.plataformas, plat];
      }
      return { ...prev, plataformas: nuevas };
    });
  };

  const handleSeleccionarEditar = (juego) => {
    setEditandoId(juego.id);
    const plataformasArr = juego.plataforma ? juego.plataforma.split(',').map(p => p.trim().toLowerCase()) : ['nintendo'];
    setFormJuego({
      titulo: juego.titulo,
      plataformas: plataformasArr,
      descripcion: juego.descripcion || '',
      precio: juego.precio,
      imagen: juego.imagen || '/img/logo.png',
      es_preventa: juego.es_preventa,
      fecha_lanzamiento: juego.fecha_lanzamiento || 'Disponible ya',
      stock: juego.stock
    });
    setMensaje({ texto: `Editando: "${juego.titulo}"`, tipo: 'info' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setFormJuego(formInicial);
    setMensaje({ texto: '', tipo: '' });
  };

  const handleGuardarJuego = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    if (formJuego.plataformas.length === 0) {
      setMensaje({ texto: 'Debes seleccionar al menos una plataforma.', tipo: 'danger' });
      return;
    }

    const payload = {
      ...formJuego,
      plataforma: formJuego.plataformas.join(',')
    };

    try {
      const url = editandoId ? `/api/juegos/${editandoId}` : '/api/juegos';
      const method = editandoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar el juego');

      const accion = editandoId ? 'actualizado' : 'añadido';
      setMensaje({ texto: `¡"${formJuego.titulo}" ${accion} correctamente!`, tipo: 'success' });
      setEditandoId(null);
      setFormJuego(formInicial);
      cargarDatos();
    } catch (err) {
      setMensaje({ texto: err.message, tipo: 'danger' });
    }
  };

  const handleEliminarJuego = async (id, titulo) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${titulo}"?`)) return;
    try {
      const res = await fetch(`/api/juegos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMensaje({ texto: `"${titulo}" eliminado con éxito`, tipo: 'info' });
        if (editandoId === id) {
          handleCancelarEdicion();
        }
        cargarDatos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const badgesMap = {
    nintendo: 'badge bg-danger',
    playstation: 'badge bg-primary',
    xbox: 'badge bg-success'
  };

  if (loading) {
    return (
      <main className="container text-center py-5">
        <div className="spinner-border text-light" role="status"></div>
        <p className="text-white mt-3">Cargando panel de administración...</p>
      </main>
    );
  }

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1">Panel de Control de Administrador</h2>
          <p className="text-secondary mb-0">Gestión de catálogo multiplataforma, edición, usuarios y métricas</p>
        </div>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} shadow-sm`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {/* Tarjetas de Métricas */}
      {metricas && metricas.resumen && (
        <div className="row g-3 mb-5">
          <div className="col-sm-6 col-xl-3">
            <div className="card text-bg-dark border-secondary h-100 p-3 shadow-sm">
              <div className="text-secondary text-uppercase small fw-bold">Productos Vendidos</div>
              <div className="fs-2 fw-bold text-success mt-2">{metricas.resumen.totalVendidos} uds.</div>
              <small className="text-muted">Total facturado: ${Number(metricas.resumen.ingresosTotales).toLocaleString('es-CL')}</small>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card text-bg-dark border-secondary h-100 p-3 shadow-sm">
              <div className="text-secondary text-uppercase small fw-bold">Productos en Carritos</div>
              <div className="fs-2 fw-bold text-warning mt-2">{metricas.resumen.totalEnCarritos} uds.</div>
              <small className="text-muted">Interés actual de usuarios</small>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card text-bg-dark border-secondary h-100 p-3 shadow-sm">
              <div className="text-secondary text-uppercase small fw-bold">Usuarios Registrados</div>
              <div className="fs-2 fw-bold text-info mt-2">{metricas.resumen.usuariosTotales}</div>
              <small className="text-muted">Base de clientes activos</small>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card text-bg-dark border-secondary h-100 p-3 shadow-sm">
              <div className="text-secondary text-uppercase small fw-bold">Juegos en Catálogo</div>
              <div className="fs-2 fw-bold text-light mt-2">{metricas.resumen.juegosTotales}</div>
              <small className="text-muted">Disponibles y preventas</small>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4 mb-5">
        {/* Formulario para añadir / editar juegos */}
        <div className="col-lg-5">
          <div className={`card shadow border-0 ${editandoId ? 'border-warning border-2' : ''}`} style={{ backgroundColor: '#e9ecef' }}>
            <div className="py-3 px-4 fw-bold border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: editandoId ? '#ffe8b3' : '#cfd4da', color: '#212529' }}>
              <span>{editandoId ? '✏️ Editar Videojuego' : '➕ Añadir Videojuego al Catálogo'}</span>
              {editandoId && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark"
                  onClick={handleCancelarEdicion}
                >
                  Cancelar
                </button>
              )}
            </div>
            <div className="card-body p-4 text-dark">
              <form onSubmit={handleGuardarJuego}>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-uppercase">Título del Juego *</label>
                  <input
                    type="text"
                    name="titulo"
                    className="form-control"
                    value={formJuego.titulo}
                    onChange={handleChange}
                    placeholder="Ej. Halo Infinite"
                    required
                  />
                </div>

                {/* Selección múltiple de plataformas */}
                <div className="mb-3">
                  <label className="form-label fw-bold small text-uppercase d-block mb-2">
                    Plataformas Disponibles *
                  </label>
                  <div className="d-flex gap-2 flex-wrap">
                    {[
                      { id: 'nintendo', label: 'Nintendo Switch', badgeClass: 'btn-outline-danger' },
                      { id: 'playstation', label: 'PlayStation 5', badgeClass: 'btn-outline-primary' },
                      { id: 'xbox', label: 'Xbox Series X|S', badgeClass: 'btn-outline-success' }
                    ].map(p => {
                      const activo = formJuego.plataformas.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlataformaToggle(p.id)}
                          className={`btn btn-sm ${activo ? 'btn-dark text-white fw-bold' : p.badgeClass}`}
                        >
                          {activo ? '✓ ' : '+ '} {p.label}
                        </button>
                      );
                    })}
                  </div>
                  <small className="text-muted d-block mt-1">
                    Puedes marcar varias para que aparezca en múltiples catálogos simultáneamente.
                  </small>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-bold small text-uppercase">Precio (CLP) *</label>
                    <input
                      type="number"
                      name="precio"
                      className="form-control"
                      value={formJuego.precio}
                      onChange={handleChange}
                      placeholder="59990"
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold small text-uppercase">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      value={formJuego.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-uppercase">Ruta o URL Imagen</label>
                  <input
                    type="text"
                    name="imagen"
                    className="form-control"
                    value={formJuego.imagen}
                    onChange={handleChange}
                    placeholder="/img/logo.png"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-uppercase">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows="2"
                    className="form-control"
                    value={formJuego.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción resumida del juego..."
                  ></textarea>
                </div>

                <div className="row g-3 mb-3 align-items-center">
                  <div className="col-sm-6">
                    <label className="form-label fw-bold small text-uppercase">Fecha Lanzamiento</label>
                    <input
                      type="text"
                      name="fecha_lanzamiento"
                      className="form-control"
                      value={formJuego.fecha_lanzamiento}
                      onChange={handleChange}
                      placeholder="Disponible ya / 2026"
                    />
                  </div>
                  <div className="col-sm-6 pt-sm-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkPreventa"
                        name="es_preventa"
                        checked={formJuego.es_preventa === 1}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-bold" htmlFor="checkPreventa">
                        ¿Es Preventa?
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className={`btn ${editandoId ? 'btn-warning text-dark' : 'btn-dark'} flex-grow-1 fw-bold py-2 text-uppercase`}>
                    {editandoId ? 'Guardar Cambios' : 'Guardar en Catálogo'}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      className="btn btn-secondary py-2"
                      onClick={handleCancelarEdicion}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Lista de usuarios registrados */}
        <div className="col-lg-7">
          <div className="card shadow text-bg-dark border-secondary h-100">
            <div className="card-header py-3 px-4 border-secondary fw-bold d-flex justify-content-between align-items-center">
              <span>👥 Usuarios Registrados ({usuarios.length})</span>
            </div>
            <div className="card-body p-0 table-responsive" style={{ maxHeight: '480px' }}>
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr className="border-secondary text-secondary small text-uppercase">
                    <th className="px-3">ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Ubicación</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-secondary">
                      <td className="px-3 text-secondary">{u.id}</td>
                      <td className="fw-semibold">{u.nombre_completo}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="small text-secondary">
                        {u.comuna ? `${u.comuna}` : 'No especificada'}
                      </td>
                      <td className="small text-secondary">{new Date(u.creado_en).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Gestión de Catálogo Existente */}
      <div className="card shadow text-bg-dark border-secondary mb-5">
        <div className="card-header py-3 px-4 border-secondary fw-bold d-flex justify-content-between align-items-center">
          <span>🎮 Gestión de Juegos en Catálogo ({juegos.length})</span>
        </div>
        <div className="card-body p-0 table-responsive" style={{ maxHeight: '400px' }}>
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr className="border-secondary text-secondary small text-uppercase">
                <th className="px-3">Carátula</th>
                <th>Título</th>
                <th>Plataformas</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Tipo</th>
                <th className="text-end px-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juegos.map((j) => (
                <tr key={j.id} className={`border-secondary ${editandoId === j.id ? 'table-active' : ''}`}>
                  <td className="px-3">
                    <img src={j.imagen} alt={j.titulo} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
                  </td>
                  <td className="fw-semibold">{j.titulo}</td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {j.plataforma.split(',').map(plat => {
                        const pTrim = plat.trim().toLowerCase();
                        return (
                          <span key={pTrim} className={`${badgesMap[pTrim] || 'badge bg-secondary'} text-uppercase`}>
                            {pTrim}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="text-success fw-bold">${Number(j.precio).toLocaleString('es-CL')}</td>
                  <td>{j.stock}</td>
                  <td>
                    {j.es_preventa === 1 ? (
                      <span className="badge bg-warning text-dark fw-bold">PREVENTA</span>
                    ) : (
                      <span className="badge bg-light text-dark">DISPONIBLE</span>
                    )}
                  </td>
                  <td className="text-end px-3">
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => handleSeleccionarEditar(j)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleEliminarJuego(j.id, j.titulo)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Gestión de Solicitudes y Mensajes de Contacto */}
      <div className="card shadow text-bg-dark border-secondary mb-4">
        <div className="card-header py-3 px-4 border-secondary fw-bold d-flex justify-content-between align-items-center">
          <span>📩 Gestión de Solicitudes y Contacto ({solicitudes.length})</span>
        </div>
        <div className="card-body p-0 table-responsive" style={{ maxHeight: '450px' }}>
          {solicitudes.length === 0 ? (
            <div className="text-center py-4 text-secondary">
              No hay solicitudes ni mensajes registrados.
            </div>
          ) : (
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr className="border-secondary text-secondary small text-uppercase">
                  <th className="px-3">Fecha</th>
                  <th>Origen</th>
                  <th>Usuario / Remitente</th>
                  <th>Tipo / Asunto</th>
                  <th>Detalle</th>
                  <th>Estado</th>
                  <th className="text-end px-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s, idx) => (
                  <tr key={`${s.origen}-${s.id}-${idx}`} className="border-secondary">
                    <td className="px-3 text-secondary small">{new Date(s.creado_en).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${s.origen === 'Contacto Web' ? 'bg-info text-dark' : 'bg-primary'}`}>
                        {s.origen}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold">{s.usuario_nombre || 'Anónimo'}</div>
                      <small className="text-secondary">{s.usuario_email}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary mb-1 d-block" style={{ width: 'fit-content' }}>{s.tipo}</span>
                      <small className="fw-semibold">{s.asunto}</small>
                    </td>
                    <td style={{ maxWidth: '300px' }} className="small text-light text-opacity-75">
                      {s.detalle}
                    </td>
                    <td>
                      <span className={`badge ${s.estado === 'Resuelto' ? 'bg-success' : s.estado === 'En Revisión' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="text-end px-3">
                      {s.origen === 'Interna' && (
                        <select
                          className="form-select form-select-sm bg-dark text-light border-secondary"
                          style={{ width: '130px', display: 'inline-block' }}
                          value={s.estado}
                          onChange={async (e) => {
                            const nuevoEstado = e.target.value;
                            await fetch(`/api/admin/solicitudes/${s.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ estado: nuevoEstado })
                            });
                            cargarDatos();
                          }}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Revisión">En Revisión</option>
                          <option value="Resuelto">Resuelto</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
