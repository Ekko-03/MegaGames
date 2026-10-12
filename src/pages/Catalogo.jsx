import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Catalogo() {
  const { plataforma } = useParams();
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  const titulos = {
    nintendo: 'Juegos de Nintendo Switch',
    playstation: 'Juegos de PlayStation 5',
    xbox: 'Juegos de Xbox Series X|S'
  };

  const badges = {
    nintendo: 'badge bg-danger',
    playstation: 'badge bg-primary',
    xbox: 'badge bg-success'
  };

  const tituloMostrado = titulos[plataforma] || 'Catálogo de Videojuegos';

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = plataforma 
      ? `/api/juegos?plataforma=${encodeURIComponent(plataforma)}`
      : '/api/juegos';

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el catálogo');
        return res.json();
      })
      .then(data => {
        setJuegos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo cargar el catálogo de videojuegos.');
        setLoading(false);
      });
  }, [plataforma]);

  const juegosFiltrados = juegos.filter(j => 
    j.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    j.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold mb-1 text-uppercase">{tituloMostrado}</h2>
          <p className="text-light text-opacity-75 mb-0">
            {juegos.length} títulos disponibles
          </p>
        </div>
        <div style={{ maxWidth: '320px', width: '100%' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar juego..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-white mt-3">Cargando catálogo...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger shadow-sm" role="alert">
          <h5 className="alert-heading fw-bold">Atención</h5>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && juegosFiltrados.length === 0 && (
        <div className="alert alert-secondary text-dark shadow-sm" role="alert">
          <h4 className="alert-heading fw-bold">Sin resultados</h4>
          <p>No se encontraron juegos para los criterios seleccionados.</p>
        </div>
      )}

      {!loading && !error && juegosFiltrados.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {juegosFiltrados.map((juego) => (
            <div className="col" key={juego.id}>
              <div className="card h-100 text-bg-dark border-secondary shadow-sm hover-shadow d-flex flex-column">
                <div style={{ height: '220px', overflow: 'hidden', backgroundColor: '#111' }} className="d-flex align-items-center justify-content-center">
                  <img
                    src={juego.imagen}
                    alt={juego.titulo}
                    className="card-img-top"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/img/logo.png'; }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-1">
                    <div className="d-flex gap-1 flex-wrap">
                      {juego.plataforma.split(',').map((plat) => {
                        const pTrim = plat.trim().toLowerCase();
                        return (
                          <span key={pTrim} className={badges[pTrim] || 'badge bg-secondary'}>
                            {pTrim.toUpperCase()}
                          </span>
                        );
                      })}
                    </div>
                    {juego.es_preventa === 1 && (
                      <span className="badge bg-warning text-dark fw-bold">PREVENTA</span>
                    )}
                  </div>
                  <h5 className="card-title fw-bold fs-6 mb-2">{juego.titulo}</h5>
                  <p className="card-text text-light text-opacity-75 small flex-grow-1">
                    {juego.descripcion}
                  </p>
                  <div className="pt-2 border-top border-secondary mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fs-5 fw-bold text-success">
                        ${Number(juego.precio).toLocaleString('es-CL')}
                      </span>
                      <small className="text-muted">Stock: {juego.stock}</small>
                    </div>
                    <div className="d-flex gap-2 mb-2">
                      <button
                        className="btn btn-outline-light flex-grow-1 fw-bold btn-sm"
                        onClick={async () => {
                          const raw = localStorage.getItem('megagames_user');
                          const user = raw ? JSON.parse(raw) : null;
                          if (!user) {
                            alert('Inicia sesión para añadir productos a tu carrito');
                            return;
                          }
                          await fetch('/api/carrito', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ usuario_id: user.id, juego_id: juego.id, cantidad: 1 })
                          });
                          alert(`¡"${juego.titulo}" añadido al carrito!`);
                        }}
                      >
                        🛒 Carrito
                      </button>
                      <button
                        className="btn btn-success flex-grow-1 fw-bold btn-sm"
                        onClick={async () => {
                          const raw = localStorage.getItem('megagames_user');
                          const user = raw ? JSON.parse(raw) : null;
                          await fetch('/api/comprar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ usuario_id: user ? user.id : null, juego_id: juego.id, cantidad: 1 })
                          });
                          alert(`¡Compra de "${juego.titulo}" completada con éxito!`);
                        }}
                      >
                        {juego.es_preventa === 1 ? 'Reservar' : 'Comprar'}
                      </button>
                    </div>
                    <button
                      className="btn btn-outline-danger w-100 btn-sm fw-bold"
                      onClick={async () => {
                        const raw = localStorage.getItem('megagames_user');
                        const user = raw ? JSON.parse(raw) : null;
                        if (!user) {
                          alert('Inicia sesión para guardar en tu lista de deseos');
                          return;
                        }
                        const res = await fetch('/api/usuario/deseos', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ usuario_id: user.id, juego_id: juego.id })
                        });
                        if (res.ok) alert(`¡"${juego.titulo}" guardado en tu lista de deseos!`);
                      }}
                    >
                      ❤️ Agregar a Lista de Deseos
                    </button>
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