import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFillDemo = () => {
    setFormData({ email: 'gamer@megagames.cl', password: '123456' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // Guardar usuario en localStorage
      localStorage.setItem('megagames_user', JSON.stringify(data.usuario));

      setMensaje({
        texto: `¡Bienvenido de nuevo, ${data.usuario.nombre_completo}! Redirigiendo...`,
        tipo: 'success'
      });

      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Recargar para actualizar navbar
      }, 1200);
    } catch (err) {
      setMensaje({ texto: err.message, tipo: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-fluid px-4 px-lg-5 my-5 d-flex justify-content-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: '440px', width: '100%', backgroundColor: '#e9ecef' }}>
        <div className="py-3 px-4 fw-bold border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#cfd4da', color: '#212529', fontSize: '1.05rem' }}>
          <span>Iniciar Sesión</span>
        </div>
        <div className="card-body p-4 p-sm-5 text-dark">
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo} shadow-sm`} role="alert">
              {mensaje.texto}
            </div>
          )}

          <div className="alert alert-info py-2 px-3 small mb-3">
            <div className="fw-bold mb-1">Cuentas disponibles para prueba:</div>
            <div className="d-flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@megagames.cl', password: '123456' })}
                className="btn btn-sm btn-outline-danger flex-grow-1"
              >
                Probar Administrador
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'gamer@megagames.cl', password: '123456' })}
                className="btn btn-sm btn-outline-primary flex-grow-1"
              >
                Probar Usuario Normal
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-uppercase mb-1">CONTRASEÑA</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-center pt-2 mb-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark w-100 py-2 fw-bold text-uppercase shadow-sm"
              >
                {loading ? 'AUTENTICANDO...' : 'ENTRAR'}
              </button>
            </div>
            <div className="text-center">
              <Link to="/registro" className="text-decoration-none text-muted small">
                ¿No tienes cuenta? <span className="fw-bold text-dark">Regístrate aquí</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}