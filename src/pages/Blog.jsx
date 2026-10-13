import { Link } from 'react-router-dom';

export default function Blog() {
  const noticias = [
    { id: 1, categoria: 'Lanzamientos', titulo: 'GTA VI anuncia fecha oficial para PC y Consolas', img: '/img/Gta6.jpg', fecha: '12 Oct 2026' },
    { id: 2, categoria: 'Hardware', titulo: 'PlayStation 5 Pro: ¿Vale la pena el cambio?', img: '/img/play.jpg', fecha: '10 Oct 2026' },
    { id: 3, categoria: 'Rumores', titulo: 'Filtran detalles de la nueva consola de Nintendo', img: '/img/sm_wonder.jpg', fecha: '08 Oct 2026' },
    { id: 4, categoria: 'eSports', titulo: 'El equipo chileno hace historia en el mundial', img: '/img/xbox.webp', fecha: '05 Oct 2026' },
  ];

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <div className="mb-4 border-bottom border-secondary pb-2 d-flex justify-content-between align-items-end">
        <h2 className="text-white fw-bold mb-0 text-uppercase">MegaGames News</h2>
        <span className="text-muted small">Tu diario gamer de confianza</span>
      </div>

      {/* Noticia Principal */}
      <div className="card text-bg-dark border-secondary shadow-sm mb-5 hover-shadow">
        <div className="row g-0">
          <div className="col-lg-8">
            <img src="/img/gears_eday.jpg" className="img-fluid rounded-start" alt="Noticia Principal" style={{ height: '100%', objectFit: 'cover', minHeight: '350px' }} onError={(e) => e.target.src = '/img/logo.png'} />
          </div>
          <div className="col-lg-4 d-flex align-items-center">
            <div className="card-body p-4 p-lg-5">
              <span className="badge bg-danger mb-2">Exclusivo</span>
              <h3 className="card-title fw-bold text-white mb-3">Gears of War: E-Day revoluciona la Xbox Showcase</h3>
              <p className="card-text text-light text-opacity-75">
                El esperado retorno a los orígenes de la saga ha dejado a los fans sin palabras. Analizamos el tráiler cuadro por cuadro y lo que significa para el futuro de Xbox.
              </p>
              <p className="card-text"><small className="text-muted">Publicado hoy por Redacción MegaGames</small></p>
              <Link to="/blog/principal" className="btn btn-outline-light mt-2 fw-bold">Leer artículo completo</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Grilla de Noticias Secundarias */}
      <h4 className="text-white fw-bold border-bottom border-secondary pb-2 mb-4">Últimas Noticias</h4>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {noticias.map(noticia => (
          <div className="col" key={noticia.id}>
            <div className="card h-100 text-bg-dark border-secondary shadow-sm hover-shadow">
              <img src={noticia.img} className="card-img-top" alt={noticia.titulo} style={{ height: '180px', objectFit: 'cover' }} onError={(e) => e.target.src = '/img/logo.png'} />
              <div className="card-body d-flex flex-column">
                <div className="mb-2">
                  <span className="badge bg-secondary">{noticia.categoria}</span>
                </div>
                <h5 className="card-title fw-bold fs-6">{noticia.titulo}</h5>
                <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                  <small className="text-muted">{noticia.fecha}</small>
                  <Link to={`/blog/${noticia.id}`} className="text-success text-decoration-none fw-bold small">Leer más →</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}