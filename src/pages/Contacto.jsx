import { useState } from 'react';

export default function Contacto() {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setEnviado(true);
      setFormData({ nombre: '', email: '', mensaje: '' });
      setTimeout(() => setEnviado(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <h2 className="text-white text-center fw-bold mb-4">Contacto</h2>
      <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: '600px', backgroundColor: '#e9ecef' }}>
        <div className="py-3 px-4 fw-bold border-bottom" style={{ backgroundColor: '#cfd4da', color: '#212529', fontSize: '1.05rem' }}>
          Envíanos un mensaje
        </div>
        <div className="card-body p-4 p-sm-5 text-dark">
          {enviado && (
            <div className="alert alert-success fw-bold shadow-sm" role="alert">
              ¡Mensaje enviado con éxito! Te responderemos a la brevedad.
            </div>
          )}

          {error && (
            <div className="alert alert-danger fw-bold shadow-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu.correo@ejemplo.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-uppercase mb-1">Mensaje</label>
              <textarea
                name="mensaje"
                className="form-control"
                rows="4"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escribe tu consulta o sugerencia..."
                required
              ></textarea>
            </div>
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark w-100 py-2 fw-bold text-uppercase shadow-sm"
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}