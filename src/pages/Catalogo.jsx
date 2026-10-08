import { useParams } from 'react-router-dom';

export default function Catalogo() {
  const { plataforma } = useParams();
  
  const titulos = {
    nintendo: 'Juegos de Nintendo',
    playstation: 'Juegos de PlayStation 5',
    xbox: 'Juegos de Xbox'
  };

  const tituloMostrado = titulos[plataforma] || 'Catálogo de Juegos';

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <h2 className="text-white fw-bold mb-4 text-uppercase">{tituloMostrado}</h2>
      <div className="alert alert-secondary text-dark shadow-sm" role="alert">
        <h4 className="alert-heading fw-bold">¡Próximamente!</h4>
        <p>El inventario completo de {tituloMostrado} se está actualizando.</p>
        <hr />
        <p className="mb-0">Vuelve pronto para ver los últimos lanzamientos.</p>
      </div>
    </main>
  );
}