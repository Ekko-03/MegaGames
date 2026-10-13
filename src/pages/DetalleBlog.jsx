import { useParams, Link } from 'react-router-dom';

export default function DetalleBlog() {
  const { id } = useParams();

  
  
  if (id === 'principal') {
    return (
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Link to="/blog" className="text-decoration-none text-muted mb-4 d-inline-block fw-bold">← Volver a Noticias</Link>
            <div className="mb-4">
              <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase">Exclusivo</span>
              <h1 className="text-white fw-bold mb-3 display-5">Gears of War: E-Day revoluciona la Xbox Showcase</h1>
              <div className="text-muted mb-4 d-flex align-items-center gap-3">
                <span>Por <strong>Redacción MegaGames</strong></span>
                <span>•</span><span>12 Oct 2026</span>
              </div>
            </div>
            <img src="/img/gears_eday.jpg" className="img-fluid rounded shadow mb-5 w-100" alt="Gears of War" style={{ maxHeight: '450px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
            <div className="text-light text-opacity-75 fs-5" style={{ lineHeight: '1.8' }}>
              <p>El esperado retorno a los orígenes de la saga ha dejado a los fans sin palabras. Durante la última presentación de Xbox, el anuncio de Gears of War: E-Day se robó el show. Este título nos llevará al "Día de la Emergencia", el momento exacto en que la horda Locust emergió a la superficie del planeta Sera.</p>
              <h3 className="text-white fw-bold mt-5 mb-3">Volviendo a las raíces del terror</h3>
              <p>The Coalition ha confirmado que usarán Unreal Engine 5 para llevar los gráficos al límite. Los jugadores controlarán a versiones más jóvenes de Marcus Fenix y Dom Santiago, explorando su hermandad forjada en la batalla.</p>
              <div className="p-4 bg-dark border-start border-danger border-4 my-5 rounded shadow-sm">
                <em className="text-white fs-4">"Este es sin duda uno de los anuncios más importantes de la década para los fans de Xbox y los shooters en tercera persona."</em>
              </div>
              <p>Aún no hay fecha de lanzamiento exacta, pero se espera que llegue a Xbox Series X|S y PC, directo a Game Pass desde el día uno.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }


 
  if (id === '1') {
    return (
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Link to="/blog" className="text-decoration-none text-muted mb-4 d-inline-block fw-bold">← Volver a Noticias</Link>
            <div className="mb-4">
              <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase">Lanzamientos</span>
              <h1 className="text-white fw-bold mb-3 display-5">GTA VI anuncia fecha oficial para PC y Consolas</h1>
              <div className="text-muted mb-4 d-flex align-items-center gap-3">
                <span>Por <strong>Equipo Editorial</strong></span>
                <span>•</span><span>12 Oct 2026</span>
              </div>
            </div>
            <img src="/img/Gta6.jpg" className="img-fluid rounded shadow mb-5 w-100" alt="GTA VI" style={{ maxHeight: '450px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
            <div className="text-light text-opacity-75 fs-5" style={{ lineHeight: '1.8' }}>
              <p>Rockstar Games ha sacudido el internet nuevamente al revelar detalles cruciales sobre la ventana de lanzamiento de Grand Theft Auto VI, el juego más esperado de la historia.</p>
              <h3 className="text-white fw-bold mt-5 mb-3">Vice City más viva que nunca</h3>
              <p>El mapa de Leonida promete ser un ecosistema vivo donde las acciones del jugador tendrán peso real. Se confirmó que el juego aprovechará el trazado de rayos y tiempos de carga nulos gracias a los SSD de la actual generación.</p>
              <div className="p-4 bg-dark border-start border-danger border-4 my-5 rounded shadow-sm">
                <em className="text-white fs-4">"El nivel de realismo e inmersión que hemos logrado en GTA VI redefinirá lo que es un mundo abierto."</em>
              </div>
              <p>La preventa del juego comenzará en un par de meses, y las expectativas apuntan a romper todos los récords históricos de la industria del entretenimiento.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  
  
  if (id === '2') {
    return (
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Link to="/blog" className="text-decoration-none text-muted mb-4 d-inline-block fw-bold">← Volver a Noticias</Link>
            <div className="mb-4">
              <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase">Hardware</span>
              <h1 className="text-white fw-bold mb-3 display-5">PlayStation 5 Pro: ¿Vale la pena el cambio?</h1>
              <div className="text-muted mb-4 d-flex align-items-center gap-3">
                <span>Por <strong>Tech Gamer</strong></span>
                <span>•</span><span>10 Oct 2026</span>
              </div>
            </div>
            <img src="/img/play.jpg" className="img-fluid rounded shadow mb-5 w-100" alt="PS5 Pro" style={{ maxHeight: '450px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
            <div className="text-light text-opacity-75 fs-5" style={{ lineHeight: '1.8' }}>
              <p>Sony finalmente ha lanzado al mercado la esperada PS5 Pro, la actualización de mitad de generación que promete 4K a 60FPS estables en los juegos más exigentes del catálogo.</p>
              <h3 className="text-white fw-bold mt-5 mb-3">PSSR y mayor potencia gráfica</h3>
              <p>El gran secreto de esta consola es el PlayStation Spectral Super Resolution (PSSR), que mediante inteligencia artificial mejora la resolución sin sacrificar el rendimiento.</p>
              <div className="p-4 bg-dark border-start border-danger border-4 my-5 rounded shadow-sm">
                <em className="text-white fs-4">"Para el jugador entusiasta que busca la máxima fidelidad visual, la PS5 Pro es el nuevo estándar absoluto."</em>
              </div>
              <p>Si bien el precio ha sido un punto de debate en foros y redes sociales, los usuarios que ya cuentan con un televisor de gama alta notarán la diferencia de forma inmediata.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  
  
  if (id === '3') {
    return (
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Link to="/blog" className="text-decoration-none text-muted mb-4 d-inline-block fw-bold">← Volver a Noticias</Link>
            <div className="mb-4">
              <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase">Rumores</span>
              <h1 className="text-white fw-bold mb-3 display-5">Filtran detalles de la nueva consola de Nintendo</h1>
              <div className="text-muted mb-4 d-flex align-items-center gap-3">
                <span>Por <strong>Insider Nin</strong></span>
                <span>•</span><span>08 Oct 2026</span>
              </div>
            </div>
            <img src="/img/sm_wonder.jpg" className="img-fluid rounded shadow mb-5 w-100" alt="Nintendo" style={{ maxHeight: '450px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
            <div className="text-light text-opacity-75 fs-5" style={{ lineHeight: '1.8' }}>
              <p>Fuentes cercanas a las fábricas de ensamblaje han filtrado las posibles especificaciones técnicas del sucesor de la Nintendo Switch, apodado temporalmente en redes como "Switch 2".</p>
              <h3 className="text-white fw-bold mt-5 mb-3">Retrocompatibilidad y mandos magnéticos</h3>
              <p>Los reportes indican que mantendrá el exitoso formato híbrido, pero con una pantalla más grande, mandos que se acoplan magnéticamente y soporte completo para todo tu catálogo actual de juegos.</p>
              <div className="p-4 bg-dark border-start border-danger border-4 my-5 rounded shadow-sm">
                <em className="text-white fs-4">"Nintendo no busca competir en potencia cruda, sino en ofrecer una experiencia de juego perfecta, innovadora y continuista."</em>
              </div>
              <p>El anuncio oficial se espera para principios del próximo año, con un catálogo de lanzamiento que, según rumores, incluiría un nuevo título de Mario en 3D.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  
  
  if (id === '4') {
    return (
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Link to="/blog" className="text-decoration-none text-muted mb-4 d-inline-block fw-bold">← Volver a Noticias</Link>
            <div className="mb-4">
              <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase">eSports</span>
              <h1 className="text-white fw-bold mb-3 display-5">El equipo chileno hace historia en el mundial</h1>
              <div className="text-muted mb-4 d-flex align-items-center gap-3">
                <span>Por <strong>Deportes Electrónicos</strong></span>
                <span>•</span><span>05 Oct 2026</span>
              </div>
            </div>
            <img src="/img/xbox.webp" className="img-fluid rounded shadow mb-5 w-100" alt="eSports" style={{ maxHeight: '450px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
            <div className="text-light text-opacity-75 fs-5" style={{ lineHeight: '1.8' }}>
              <p>Un hito sin precedentes para la escena competitiva de nuestro país. El equipo nacional de eSports ha logrado clasificar a la gran final del mundial más importante de este año.</p>
              <h3 className="text-white fw-bold mt-5 mb-3">Esfuerzo, estrategia y puro talento</h3>
              <p>Superando a equipos asiáticos y europeos que figuraban como favoritos, los jugadores chilenos demostraron un nivel de coordinación y mecánicas que sorprendió a los analistas internacionales.</p>
              <div className="p-4 bg-dark border-start border-danger border-4 my-5 rounded shadow-sm">
                <em className="text-white fs-4">"Nunca dejamos de creer. Entrenamos 12 horas diarias para esto y vamos a dejar la copa en casa."</em>
              </div>
              <p>La gran final se disputará este domingo y será transmitida en pantallas gigantes en varios puntos de Santiago. Todo el país estará apoyando.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container my-5 text-center">
      <h2 className="text-white fw-bold mb-4">Artículo no encontrado</h2>
      <p className="text-muted">Parece que la noticia que buscas no existe o fue eliminada.</p>
      <Link to="/blog" className="btn btn-outline-light mt-3 px-4 py-2 fw-bold">← Volver al Blog</Link>
    </main>
  );
}