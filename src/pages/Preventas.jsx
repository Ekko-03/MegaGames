import { useState, useEffect } from 'react';

export default function Preventas() {
  const [preventas, setPreventas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const badges = {
    nintendo: 'badge bg-danger',
    playstation: 'badge bg-primary',
    xbox: 'badge bg-success'
  };

  useEffect(() => {
    fetch('/api/juegos?preventa=1')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener las preventas');
        return res.json();
      })
      .then(data => {
        setPreventas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar las preventas disponibles.');
        setLoading(false);
      });
  }, []);

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <div className="text-center mb-5">
        <h2 className="text-white fw-bold text-uppercase display-6">Preventas Exclusivas</h2>
        <p className="text-light text-opacity-75 fs-5">
          Reserva los títulos más esperados y asegura tu copia antes de su lanzamiento.
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-white mt-3">Cargando preventas...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger shadow-sm text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && preventas.length === 0 && (
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-lg border-0 text-bg-dark border-secondary p-4">
              <h3 className="fw-bold text-danger">¡Asegura tu copia!</h3>
              <p className="fs-5 mt-3">Las reservas para los títulos más esperados se abrirán próximamente.</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && preventas.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {preventas.map((juego) => (
            <div className="col" key={juego.id}>
              <div className="card h-100 text-bg-dark border-secondary shadow position-relative">
                <span className="position-absolute top-0 end-0 badge bg-danger m-3 fs-6 px-3 py-2 shadow">
                  Lanzamiento: {juego.fecha_lanzamiento || '2026'}
                </span>
                <img
                  src={juego.imagen}
                  alt={juego.titulo}
                  className="card-img-top"
                  style={{ height: '240px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/img/logo.png'; }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="mb-2 d-flex gap-1 flex-wrap">
                    {juego.plataforma.split(',').map(plat => {
                      const pTrim = plat.trim().toLowerCase();
                      return (
                        <span key={pTrim} className={`${badges[pTrim] || 'badge bg-secondary'} text-uppercase`}>
                          {pTrim}
                        </span>
                      );
                    })}
                  </div>
                  <h4 className="card-title fw-bold text-white mb-2">{juego.titulo}</h4>
                  <p className="card-text text-light text-opacity-75 flex-grow-1">
                    {juego.descripcion}
                  </p>
                  <div className="mt-auto pt-3 border-top border-secondary">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fs-4 fw-bold text-warning">
                        ${Number(juego.precio).toLocaleString('es-CL')}
                      </span>
                      <span className="badge bg-outline-light border text-light">
                        Cupos: {juego.stock}
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-light flex-grow-1 fw-bold btn-sm py-2"
                        onClick={async () => {
                          const raw = localStorage.getItem('megagames_user');
                          const user = raw ? JSON.parse(raw) : null;
                          if (!user) {
                            alert('Inicia sesión para añadir reservas a tu carrito');
                            return;
                          }
                          await fetch('/api/carrito', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ usuario_id: user.id, juego_id: juego.id, cantidad: 1 })
                          });
                          alert(`¡"${juego.titulo}" añadido a tus reservas!`);
                        }}
                      >
                        🛒 Al Carrito
                      </button>
                      <button
                        className="btn btn-warning flex-grow-1 fw-bold text-dark btn-sm py-2 text-uppercase"
                        onClick={async () => {
                          const raw = localStorage.getItem('megagames_user');
                          const user = raw ? JSON.parse(raw) : null;
                          await fetch('/api/comprar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ usuario_id: user ? user.id : null, juego_id: juego.id, cantidad: 1 })
                          });
                          alert(`¡Reserva confirmada para "${juego.titulo}"!`);
                        }}
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}