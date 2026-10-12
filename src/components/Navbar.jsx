import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('megagames_user');
    if (raw) {
      try {
        setUsuario(JSON.parse(raw));
      } catch (e) {
        console.error('Error parseando usuario en sesión', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('megagames_user');
    setUsuario(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand d-flex flex-column align-items-center text-center py-1 me-3" to="/">
          <img src="/img/logo.png" alt="Logo MegaGames" width="65" height="45" className="mb-1" />
          <span style={{ fontSize: '0.9rem', lineHeight: 1, fontWeight: 'bold' }}>MegaGames</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/preventas">
                Preventas
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown">
                Videojuegos
              </a>
              <ul className="dropdown-menu shadow">
                <li><Link className="dropdown-item" to="/nintendo">Nintendo Switch</Link></li>
                <li><Link className="dropdown-item" to="/playstation">PlayStation 5</Link></li>
                <li><Link className="dropdown-item" to="/xbox">Xbox Series X|S</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
          </ul>


          <div className="d-flex align-items-center gap-3">
            {usuario ? (
              <>
                <Link to="/carrito" className="btn btn-light border-dark text-dark btn-sm fw-bold d-flex align-items-center gap-1">
                  <span className="fs-5"></span>🛒 Mi Carrito
                </Link>

              <div className="dropdown">
                <button
                  className="btn btn-outline-dark btn-sm dropdown-toggle fw-bold"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  👤 {usuario.nombre_completo || usuario.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li className="dropdown-item-text text-muted small border-bottom pb-2">
                    <div>{usuario.email}</div>
                    <span className={`badge mt-1 ${usuario.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                      {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </li>
                  <li>
                    <Link className="dropdown-item fw-bold text-dark py-2" to="/cuenta">
                      👤 Mi Cuenta
                    </Link>
                  </li>
                  {usuario.rol === 'admin' && (
                    <li>
                      <Link className="dropdown-item fw-bold text-dark py-2" to="/admin">
                        ⚙️ Panel de Administrador
                      </Link>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item text-danger py-2" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </> 
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-dark btn-sm fw-semibold">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-dark btn-sm fw-semibold">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}