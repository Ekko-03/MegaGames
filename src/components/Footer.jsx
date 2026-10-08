import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-dark text-white pt-5 pb-3 mt-auto">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold">MegaGames</h5>
            <p>Tu portal definitivo para encontrar los últimos lanzamientos y videojuegos.</p>
          </div>
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold">Soporte</h5>
            <p><Link to="/soporte" className="text-white text-decoration-none">Centro de Ayuda</Link></p>
            <p><Link to="/terminos" className="text-white text-decoration-none">Términos de Servicio</Link></p>
          </div>
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold">Contacto</h5>
            <p>Av. Providencia 1234, Santiago, Chile</p>
            <p>contacto@megagames.com</p>
          </div>
        </div>
        <hr className="mb-4 border-secondary" />
        <div className="row align-items-center">
          <div className="col-12 text-center">
            <p className="mb-0 text-secondary">© 2026 MegaGames. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}