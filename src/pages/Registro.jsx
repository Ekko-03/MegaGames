import { useState, useEffect } from 'react';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre_completo: '', email: '', confirmar_email: '', password: '', 
    confirmar_password: '', telefono: '', region: '', comuna: ''
  });
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRegiones([{ id: 1, nombre: 'Región Metropolitana' }, { id: 2, nombre: 'Valparaíso' }]); 
  }, []);

  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setFormData({ ...formData, region: regionId, comuna: '' });
    setComunas([{ id: 1, nombre: 'Santiago' }, { id: 2, nombre: 'Providencia' }]); 
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setMensaje({ texto: 'Cuenta creada correctamente.', tipo: 'success' });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="container my-5 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: '580px', width: '100%', backgroundColor: '#e9ecef' }}>
        <div className="py-2 px-3 fw-bold border-bottom" style={{ backgroundColor: '#cfd4da', color: '#212529', fontSize: '1.05rem' }}>
          Registro de usuario
        </div>
        <div className="card-body p-4 p-sm-5 text-dark">
          {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`} role="alert">{mensaje.texto}</div>}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">NOMBRE COMPLETO</label>
              <input type="text" name="nombre_completo" className="form-control" onChange={handleChange} required />
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <select name="region" className="form-select text-truncate" onChange={handleRegionChange} value={formData.region} required>
                  <option value="" disabled>Seleccione la región</option>
                  {regiones.map(reg => <option key={reg.id} value={reg.id}>{reg.nombre}</option>)}
                </select>
              </div>
              <div className="col-sm-6">
                <select name="comuna" className="form-select text-truncate" onChange={handleChange} value={formData.comuna} required disabled={!formData.region}>
                  <option value="" disabled>Seleccione la comuna</option>
                  {comunas.map(com => <option key={com.id} value={com.id}>{com.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="text-center pt-2">
              <button type="submit" disabled={loading} className="btn btn-light border border-dark border-2 px-5 py-2 fw-bold text-uppercase shadow-sm">
                {loading ? 'REGISTRANDO...' : 'REGISTRAR'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}