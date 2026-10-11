import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <h2 className="text-white text-center mt-5 mb-2 fw-bold">Novedades</h2>
      <main className="container-fluid px-4 px-lg-5 my-5">
        
        {/* Carrusel */}
        <div className="d-flex justify-content-center align-items-center mb-5">
          <div id="carouselExampleAutoplaying" className="carousel slide shadow rounded overflow-hidden" data-bs-ride="carousel" style={{ maxWidth: '1000px', width: '100%' }}>
            <div className="carousel-inner">
              <div className="carousel-item active"><img src="/img/Gta6.jpg" className="d-block w-100" alt="GTA 6" /></div>
              <div className="carousel-item"><img src="/img/Tokkon.jpeg" className="d-block w-100" alt="Tokkon" /></div>
              <div className="carousel-item"><img src="/img/Wolverine.jpg" className="d-block w-100" alt="Wolverine" /></div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>
        <section className="mb-4">
          <h2 className="text-white text-center mb-4 fw-bold">Descubre nuestras plataformas</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100 text-bg-dark border-secondary shadow">
                <img src="/img/tloz_totk.jpeg" className="card-img-top" alt="Zelda" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-center">Juegos de Nintendo</h5>
                  <p className="card-text text-center">Explora el vasto mundo de aventuras épicas.</p>
                  <Link to="/nintendo" className="btn btn-danger mt-auto">Ver Catálogo</Link>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 text-bg-dark border-secondary shadow">
                <img src="/img/play.jpg" className="card-img-top" alt="PlayStation" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-center">Juegos de PlayStation</h5>
                  <p className="card-text text-center">Sumérgete en historias increíbles y gráficos de última generación.</p>
                  <Link to="/playstation" className="btn btn-primary mt-auto">Ver Catálogo</Link>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 text-bg-dark border-secondary shadow">
                <img src="/img/xbox.webp" className="card-img-top" alt="Xbox" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-center">Juegos de Xbox</h5>
                  <p className="card-text text-center">Descubre el poder de Xbox y disfruta de cientos de juegos.</p>
                  <Link to="/xbox" className="btn btn-success mt-auto">Ver Catálogo</Link>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}