import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', formData);
  };

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <div className="card shadow-lg border-0" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#e9ecef' }}>
        <div className="py-2 px-3 fw-bold border-bottom" style={{ backgroundColor: '#cfd4da', color: '#212529', fontSize: '1.05rem' }}>
          Iniciar Sesión
        </div>
        <div className="card-body p-4 p-sm-5 text-dark">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">CORREO ELECTRÓNICO</label>
              <input type="email" name="email" className="form-control" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-uppercase mb-1">CONTRASEÑA</label>
              <input type="password" name="password" className="form-control" onChange={handleChange} required />
            </div>
            <div className="text-center pt-2 mb-3">
              <button type="submit" className="btn btn-light border border-dark border-2 px-5 py-2 fw-bold text-uppercase shadow-sm">
                ENTRAR
              </button>
            </div>
            <div className="text-center">
              <Link to="/registro" className="text-decoration-none text-dark">¿No tienes cuenta? Regístrate aquí</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}