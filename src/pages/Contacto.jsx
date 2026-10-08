import { useState } from 'react';

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
    e.target.reset();
  };

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <h2 className="text-white text-center fw-bold mb-4">Contacto</h2>
      <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: '600px', backgroundColor: '#e9ecef' }}>
        <div className="py-2 px-3 fw-bold border-bottom" style={{ backgroundColor: '#cfd4da', color: '#212529', fontSize: '1.05rem' }}>
          Envíanos un mensaje
        </div>
        <div className="card-body p-4 p-sm-5 text-dark">
          {enviado && (
            <div className="alert alert-success fw-bold" role="alert">
              ¡Mensaje enviado con éxito! Te contactaremos pronto.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">Nombre Completo</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase mb-1">Correo Electrónico</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-uppercase mb-1">Mensaje</label>
              <textarea className="form-control" rows="4" required></textarea>
            </div>
            <div className="text-center pt-2">
              <button type="submit" className="btn btn-light border border-dark border-2 px-5 py-2 fw-bold text-uppercase shadow-sm">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}