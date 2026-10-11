import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    confirmar_email: '',
    password: '',
    confirmar_password: '',
    telefono: '',
    region: '',
    comuna: ''
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(true);

  // Cargar regiones
  useEffect(() => {
    fetch('/api/regiones')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRegiones(data);
        }
      })
      .catch(err => {
        console.error('Error cargando regiones:', err);
      })
      .finally(() => setLoadingGeo(false));
  }, []);

  // Cargar comunas de la región seleccionada
  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setFormData(prev => ({ ...prev, region: regionId, comuna: '' }));
    setComunas([]);

    if (regionId) {
      try {
        const res = await fetch(`/api/comunas/${regionId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setComunas(data);
        }
      } catch (err) {
        console.error('Error cargando comunas:', err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    // Validaciones en frontend
    if (formData.email !== formData.confirmar_email) {
      setMensaje({ texto: 'Los correos electrónicos no coinciden.', tipo: 'danger' });
      return;
    }

    if (formData.password !== formData.confirmar_password) {
      setMensaje({ texto: 'Las contraseñas no coinciden.', tipo: 'danger' });
      return;
    }

    if (formData.password.length < 6) {
      setMensaje({ texto: 'La contraseña debe tener al menos 6 caracteres.', tipo: 'danger' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo: formData.nombre_completo,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          region: formData.region,
          comuna: formData.comuna
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el registro');
      }

      setMensaje({
        texto: `¡Cuenta creada con éxito! Bienvenido, ${data.usuario.nombre_completo}. Redirigiendo...`,
        tipo: 'success'
      });

      // Guardar sesión en localStorage
      localStorage.setItem('megagames_user', JSON.stringify(data.usuario));

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setMensaje({ texto: err.message, tipo: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container my-5 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: '580px', width: '100%', backgroundColor: '#e9ecef' }}>
        <div className="py-3 px-4 fw-bold border-bottom" style={{ backgroundColor: '#cfd4da', color: '#212529', fontSize: '1.1rem' }}>
          <span>Registro de Usuario</span>
        </div>
        <div className="card-body p-4 p-sm-5 text-dark">
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo} shadow-sm`} role="alert">
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">Nombre Completo *</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                className="form-control"
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label fw-bold text-uppercase mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="form-control"
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold text-uppercase mb-1">Confirmar Correo *</label>
                <input
                  type="email"
                  name="confirmar_email"
                  value={formData.confirmar_email}
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Repetir correo"
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label fw-bold text-uppercase mb-1">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold text-uppercase mb-1">Confirmar Contraseña *</label>
                <input
                  type="password"
                  name="confirmar_password"
                  value={formData.confirmar_password}
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Repetir contraseña"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                className="form-control"
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <label className="form-label fw-bold text-uppercase mb-1">Región</label>
                <select
                  name="region"
                  className="form-select text-truncate"
                  onChange={handleRegionChange}
                  value={formData.region}
                  disabled={loadingGeo}
                >
                  <option value="">
                    {loadingGeo ? 'Cargando regiones...' : 'Seleccione región'}
                  </option>
                  {regiones.map(reg => (
                    <option key={reg.id} value={reg.id}>{reg.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold text-uppercase mb-1">Comuna</label>
                <select
                  name="comuna"
                  className="form-select text-truncate"
                  onChange={handleChange}
                  value={formData.comuna}
                  disabled={!formData.region || comunas.length === 0}
                >
                  <option value="">
                    {!formData.region ? 'Seleccione región primero' : 'Seleccione comuna'}
                  </option>
                  {comunas.map(com => (
                    <option key={com.id} value={com.id}>{com.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center pt-2 mb-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark px-5 py-2 fw-bold text-uppercase shadow-sm w-100"
              >
                {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="text-decoration-none text-muted small">
                ¿Ya tienes una cuenta? <span className="fw-bold text-dark">Inicia sesión aquí</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}