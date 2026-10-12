import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MiCuenta() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('compras');
  const [usuario, setUsuario] = useState(null);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Estados de cada sección
  const [compras, setCompras] = useState([]);
  const [deseos, setDeseos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  // Formulario Mis Datos
  const [formDatos, setFormDatos] = useState({
    nombre_completo: '',
    telefono: '',
    region_id: '',
    comuna_id: '',
    password: ''
  });

  // Formulario Mis Solicitudes
  const [formSolicitud, setFormSolicitud] = useState({
    tipo: 'Soporte Técnico',
    asunto: '',
    detalle: ''
  });

  const cargarDatosUsuario = async (userId) => {
    try {
      const res = await fetch(`/api/usuario/perfil/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUsuario(data);
        setFormDatos({
          nombre_completo: data.nombre_completo || '',
          telefono: data.telefono || '',
          region_id: data.region_id || '',
          comuna_id: data.comuna_id || '',
          password: ''
        });
        if (data.region_id) {
          cargarComunas(data.region_id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cargarComunas = async (regionId) => {
    if (!regionId) {
      setComunas([]);
      return;
    }
    try {
      const res = await fetch(`/api/comunas/${regionId}`);
      const data = await res.json();
      setComunas(data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarSeccion = async (seccion, userId) => {
    try {
      if (seccion === 'compras') {
        const res = await fetch(`/api/usuario/compras/${userId}`);
        const data = await res.json();
        setCompras(data);
      } else if (seccion === 'deseos') {
        const res = await fetch(`/api/usuario/deseos/${userId}`);
        const data = await res.json();
        setDeseos(data);
      } else if (seccion === 'solicitudes') {
        const res = await fetch(`/api/usuario/solicitudes/${userId}`);
        const data = await res.json();
        setSolicitudes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem('megagames_user');
    if (!raw) {
      navigate('/login');
      return;
    }
    const userLocal = JSON.parse(raw);
    setUsuario(userLocal);

    // Cargar regiones para Mis Datos
    fetch('/api/regiones')
      .then(r => r.json())
      .then(d => setRegiones(d))
      .catch(console.error);

    cargarDatosUsuario(userLocal.id);
    cargarSeccion('compras', userLocal.id);
    setLoading(false);
  }, [navigate]);

  const handleCambiarTab = (tab) => {
    setSeccionActiva(tab);
    setMensaje({ texto: '', tipo: '' });
    if (usuario) {
      cargarSeccion(tab, usuario.id);
    }
  };

  const handleActualizarDatos = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    try {
      const res = await fetch(`/api/usuario/perfil/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDatos)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar datos');

      setMensaje({ texto: '¡Tus datos han sido actualizados con éxito!', tipo: 'success' });
      setUsuario(data.usuario);
      localStorage.setItem('megagames_user', JSON.stringify(data.usuario));
      setFormDatos(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setMensaje({ texto: err.message, tipo: 'danger' });
    }
  };

  const handleEliminarDeseo = async (deseoId) => {
    try {
      const res = await fetch(`/api/usuario/deseos/${deseoId}`, { method: 'DELETE' });
      if (res.ok) {
        setDeseos(prev => prev.filter(d => d.deseo_id !== deseoId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoverACarrito = async (juegoId, deseoId, titulo) => {
    try {
      await fetch('/api/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuario.id, juego_id: juegoId, cantidad: 1 })
      });
      await handleEliminarDeseo(deseoId);
      alert(`¡"${titulo}" movido a tu carrito!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCrearSolicitud = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    try {
      const res = await fetch('/api/usuario/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuario.id,
          tipo: formSolicitud.tipo,
          asunto: formSolicitud.asunto,
          detalle: formSolicitud.detalle
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar la solicitud');

      setMensaje({ texto: '¡Solicitud enviada correctamente! Te responderemos pronto.', tipo: 'success' });
      setFormSolicitud({ tipo: 'Soporte Técnico', asunto: '', detalle: '' });
      cargarSeccion('solicitudes', usuario.id);
    } catch (err) {
      setMensaje({ texto: err.message, tipo: 'danger' });
    }
  };

  if (loading || !usuario) {
    return (
      <main className="container text-center py-5">
        <div className="spinner-border text-light" role="status"></div>
      </main>
    );
  }

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <div>
          <h2 className="text-white fw-bold mb-1">Mi Cuenta</h2>
          <p className="text-secondary mb-0">Bienvenido, {usuario.nombre_completo}</p>
        </div>
        <div>
          <span className="badge bg-secondary px-3 py-2 fs-6">
            Cliente ID: #{usuario.id}
          </span>
        </div>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} shadow-sm mb-4`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {/* Navegación por pestañas */}
      <ul className="nav nav-pills mb-4 bg-dark p-2 rounded border border-secondary gap-2">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${seccionActiva === 'compras' ? 'active bg-danger text-white' : 'text-light'}`}
            onClick={() => handleCambiarTab('compras')}
          >
            📦 Mis Compras
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${seccionActiva === 'datos' ? 'active bg-danger text-white' : 'text-light'}`}
            onClick={() => handleCambiarTab('datos')}
          >
            👤 Mis Datos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${seccionActiva === 'deseos' ? 'active bg-danger text-white' : 'text-light'}`}
            onClick={() => handleCambiarTab('deseos')}
          >
            ❤️ Lista de Deseos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${seccionActiva === 'solicitudes' ? 'active bg-danger text-white' : 'text-light'}`}
            onClick={() => handleCambiarTab('solicitudes')}
          >
            📩 Mis Solicitudes
          </button>
        </li>
      </ul>

      {/* 1. SECCIÓN MIS COMPRAS */}
      {seccionActiva === 'compras' && (
        <div className="card text-bg-dark border-secondary shadow">
          <div className="card-header border-secondary py-3 px-4 fw-bold">
            Historial de Compras y Reservas
          </div>
          <div className="card-body p-0 table-responsive">
            {compras.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <p className="fs-5 mb-2">Aún no has realizado ninguna compra.</p>
                <small>Explora nuestro catálogo y adquiere tus videojuegos favoritos.</small>
              </div>
            ) : (
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr className="border-secondary text-secondary small text-uppercase">
                    <th className="px-4">Fecha</th>
                    <th>Juego</th>
                    <th>Plataformas</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total Pagado</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map(c => (
                    <tr key={c.id} className="border-secondary">
                      <td className="px-4 text-secondary">{new Date(c.creado_en).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={c.imagen} alt={c.titulo} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
                          <span className="fw-semibold">{c.titulo}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary text-uppercase">{c.plataforma}</span>
                      </td>
                      <td>{c.cantidad}</td>
                      <td>${Number(c.precio_unitario).toLocaleString('es-CL')}</td>
                      <td className="fw-bold text-success">${Number(c.total).toLocaleString('es-CL')}</td>
                      <td>
                        <span className="badge bg-success">Completada</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 2. SECCIÓN MIS DATOS */}
      {seccionActiva === 'datos' && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0" style={{ backgroundColor: '#e9ecef' }}>
              <div className="card-header py-3 px-4 fw-bold" style={{ backgroundColor: '#cfd4da', color: '#212529' }}>
                Actualizar Información Personal
              </div>
              <div className="card-body p-4 text-dark">
                <form onSubmit={handleActualizarDatos}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Correo Electrónico (No editable)</label>
                    <input type="text" className="form-control" value={usuario.email} disabled />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Nombre Completo *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formDatos.nombre_completo}
                      onChange={(e) => setFormDatos({ ...formDatos, nombre_completo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formDatos.telefono}
                      onChange={(e) => setFormDatos({ ...formDatos, telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label fw-bold small text-uppercase">Región</label>
                      <select
                        className="form-select"
                        value={formDatos.region_id}
                        onChange={(e) => {
                          const regId = e.target.value;
                          setFormDatos({ ...formDatos, region_id: regId, comuna_id: '' });
                          cargarComunas(regId);
                        }}
                      >
                        <option value="">Selecciona región</option>
                        {regiones.map(r => (
                          <option key={r.id} value={r.id}>{r.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-bold small text-uppercase">Comuna</label>
                      <select
                        className="form-select"
                        value={formDatos.comuna_id}
                        onChange={(e) => setFormDatos({ ...formDatos, comuna_id: e.target.value })}
                        disabled={!formDatos.region_id}
                      >
                        <option value="">Selecciona comuna</option>
                        {comunas.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase">Nueva Contraseña (Opcional)</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Dejar en blanco para conservar la actual"
                      value={formDatos.password}
                      onChange={(e) => setFormDatos({ ...formDatos, password: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-dark w-100 fw-bold py-2 text-uppercase">
                    Guardar Mis Datos
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SECCIÓN LISTA DE DESEOS */}
      {seccionActiva === 'deseos' && (
        <div className="card text-bg-dark border-secondary shadow">
          <div className="card-header border-secondary py-3 px-4 fw-bold">
            Videojuegos Guardados en Lista de Deseos ({deseos.length})
          </div>
          <div className="card-body p-4">
            {deseos.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <p className="fs-5 mb-2">Tu lista de deseos está vacía.</p>
                <small>Guarda los juegos que te interesen para comprarlos más adelante.</small>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {deseos.map(d => (
                  <div className="col" key={d.deseo_id}>
                    <div className="card h-100 text-bg-dark border-secondary shadow-sm">
                      <img src={d.imagen} alt={d.titulo} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold mb-1">{d.titulo}</h5>
                        <div className="mb-2">
                          <span className="badge bg-secondary text-uppercase me-1">{d.plataforma}</span>
                          {d.es_preventa === 1 && <span className="badge bg-warning text-dark">PREVENTA</span>}
                        </div>
                        <div className="fs-5 fw-bold text-success mb-3">
                          ${Number(d.precio).toLocaleString('es-CL')}
                        </div>
                        <div className="mt-auto d-flex gap-2">
                          <button
                            className="btn btn-outline-light flex-grow-1 btn-sm fw-bold"
                            onClick={() => handleMoverACarrito(d.juego_id, d.deseo_id, d.titulo)}
                          >
                            🛒 Al Carrito
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleEliminarDeseo(d.deseo_id)}
                            title="Eliminar de lista"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SECCIÓN MIS SOLICITUDES */}
      {seccionActiva === 'solicitudes' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow border-0" style={{ backgroundColor: '#e9ecef' }}>
              <div className="card-header py-3 px-4 fw-bold" style={{ backgroundColor: '#cfd4da', color: '#212529' }}>
                Nueva Solicitud o Reclamo
              </div>
              <div className="card-body p-4 text-dark">
                <form onSubmit={handleCrearSolicitud}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Tipo de Solicitud *</label>
                    <select
                      className="form-select"
                      value={formSolicitud.tipo}
                      onChange={(e) => setFormSolicitud({ ...formSolicitud, tipo: e.target.value })}
                    >
                      <option value="Soporte Técnico">Soporte Técnico</option>
                      <option value="Consulta de Preventa">Consulta de Preventa</option>
                      <option value="Garantía y Devolución">Garantía y Devolución</option>
                      <option value="Facturación">Facturación</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Asunto *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formSolicitud.asunto}
                      onChange={(e) => setFormSolicitud({ ...formSolicitud, asunto: e.target.value })}
                      placeholder="Ej. Consulta sobre fecha de entrega"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase">Detalle del Mensaje *</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={formSolicitud.detalle}
                      onChange={(e) => setFormSolicitud({ ...formSolicitud, detalle: e.target.value })}
                      placeholder="Explica detalladamente tu caso o duda..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-dark w-100 fw-bold py-2 text-uppercase">
                    Enviar Solicitud
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card text-bg-dark border-secondary shadow h-100">
              <div className="card-header border-secondary py-3 px-4 fw-bold">
                Mis Solicitudes Registradas ({solicitudes.length})
              </div>
              <div className="card-body p-0 table-responsive">
                {solicitudes.length === 0 ? (
                  <div className="text-center py-5 text-secondary">
                    <p className="fs-5 mb-2">No tienes solicitudes pendientes.</p>
                    <small>Si tienes cualquier problema con tus compras, puedes crear una aquí.</small>
                  </div>
                ) : (
                  <table className="table table-dark table-hover mb-0 align-middle">
                    <thead>
                      <tr className="border-secondary text-secondary small text-uppercase">
                        <th className="px-3">Fecha</th>
                        <th>Origen</th>
                        <th>Tipo</th>
                        <th>Asunto / Detalle</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.map(s => (
                        <tr key={`${s.origen || 'sol'}-${s.id}`} className="border-secondary">
                          <td className="px-3 text-secondary">{new Date(s.creado_en).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${s.origen === 'Formulario de Contacto' ? 'bg-info text-dark' : 'bg-primary'}`}>
                              {s.origen || 'Interna'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{s.tipo}</span>
                          </td>
                          <td>
                            <div className="fw-semibold">{s.asunto}</div>
                            <small className="text-secondary">{s.detalle}</small>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">{s.estado}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
