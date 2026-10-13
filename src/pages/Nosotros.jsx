import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      {/* Sección Hero de Nosotros */}
      <div className="text-center mb-5">
        <img src="/img/logo.png" alt="MegaGames Logo" width="120" className="mb-3" />
        <h1 className="text-white fw-bold text-uppercase display-5">Sobre MegaGames</h1>
        <p className="text-light text-opacity-75 fs-5 mx-auto" style={{ maxWidth: '700px' }}>
          Somos más que una tienda; somos el punto de encuentro para la comunidad gamer en Chile. 
          Nuestra pasión es entregarte las mejores experiencias multiplataforma.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card h-100 text-bg-dark border-secondary shadow-sm p-4">
            <h3 className="fw-bold text-danger mb-3">🔥 Nuestra Historia</h3>
            <p className="text-light text-opacity-75" style={{ lineHeight: '1.8' }}>
              Fundada en 2026, MegaGames nació en un pequeño local en Santiago con un objetivo claro: 
              romper las barreras entre plataformas. Empezamos vendiendo juegos retro y hoy somos el 
              principal distribuidor oficial de Nintendo, PlayStation y Xbox en la región, ofreciendo 
              preventas exclusivas y un catálogo inigualable.
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100 text-bg-dark border-secondary shadow-sm p-4">
            <h3 className="fw-bold text-primary mb-3">🎯 Misión y Visión</h3>
            <p className="text-light text-opacity-75" style={{ lineHeight: '1.8' }}>
              <strong>Misión:</strong> Brindar a nuestros clientes acceso rápido, seguro y al mejor precio 
              a los últimos lanzamientos de la industria del videojuego. <br/><br/>
              <strong>Visión:</strong> Convertirnos en la plataforma número uno de e-commerce gamer en toda 
              Latinoamérica, innovando con nuestro sistema de carritos y entregas inmediatas.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-5 p-4 border border-secondary rounded" style={{ backgroundColor: '#1a1d20' }}>
        <h4 className="text-white fw-bold mb-3">¿Tienes alguna duda o propuesta comercial?</h4>
        <Link to="/contacto" className="btn btn-outline-light fw-bold px-4 py-2">Contáctanos</Link>
      </div>
    </main>
  );
}