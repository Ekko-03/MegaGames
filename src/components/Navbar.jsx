import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex flex-column align-items-center text-center py-1" to="/">
          <img src="/img/logo.png" alt="Logo MegaGames" width="70" height="50" className="mb-1" />
          <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>MegaGames</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/preventas">Preventas</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Videojuegos
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/nintendo">Nintendo</Link></li>
                <li><Link className="dropdown-item" to="/playstation">Playstation 5</Link></li>
                <li><Link className="dropdown-item" to="/xbox">Xbox</Link></li>
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Cuenta</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}