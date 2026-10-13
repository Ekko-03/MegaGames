import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function PagoExitoso() {
  const location = useLocation();
  const navigate = useNavigate();

  // Atrapamos los datos enviados desde el Carrito
  const datosCompra = location.state;

  
  if (!datosCompra) {
    return (
      <main className="container my-5 text-center">
        <div className="alert alert-warning p-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="fw-bold">No hay ninguna compra reciente</h4>
          <p className="mb-3">Parece que accediste a esta página directamente.</p>
          <button onClick={() => navigate('/')} className="btn btn-dark fw-bold">Volver al Inicio</button>
        </div>
      </main>
    );
  }

  const { cliente, productos, totalPagar } = datosCompra;
  const numeroOrden = Math.floor(100000 + Math.random() * 900000); // Número de orden aleatorio

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          {/* Encabezado de éxito */}
          <div className="card text-bg-dark border-success shadow-lg mb-4">
            <div className="card-body p-4 text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h2 className="fw-bold text-success mb-1">¡Se ha realizado la compra!</h2>
              <p className="text-secondary mb-0 fs-5">Número de orden: <strong>#{numeroOrden}</strong></p>
            </div>
          </div>

          {/* Datos de Entrega */}
          <div className="card text-bg-dark border-secondary shadow-sm mb-4">
            <div className="card-header border-secondary py-3 px-4 fw-bold">
              📍 Dirección de entrega asignada
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-sm-6">
                  <small className="text-secondary text-uppercase fw-bold d-block">Cliente</small>
                  <span className="fw-bold">{cliente.nombre} {cliente.apellidos}</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-secondary text-uppercase fw-bold d-block">Correo</small>
                  <span>{cliente.correo}</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-secondary text-uppercase fw-bold d-block">Dirección</small>
                  <span>{cliente.calle} {cliente.departamento ? `, ${cliente.departamento}` : ''}</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-secondary text-uppercase fw-bold d-block">Ubicación</small>
                  <span>Región #{cliente.region}, Comuna #{cliente.comuna}</span>
                </div>
                {cliente.indicaciones && (
                  <div className="col-12">
                    <small className="text-secondary text-uppercase fw-bold d-block">Indicaciones de entrega</small>
                    <em className="text-light text-opacity-75">"{cliente.indicaciones}"</em>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen de Productos */}
          <div className="card text-bg-dark border-secondary shadow-sm mb-4">
            <div className="card-header border-secondary py-3 px-4 fw-bold">
              📦 Detalle de productos adquiridos
            </div>
            <div className="card-body p-0 table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr className="border-secondary text-secondary small text-uppercase">
                    <th className="px-3">Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th className="text-end px-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((item) => (
                    <tr key={item.carrito_id || item.id} className="border-secondary">
                      <td className="px-3">
                        <img src={item.imagen} alt={item.titulo} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
                      </td>
                      <td className="fw-semibold">{item.titulo}</td>
                      <td>${Number(item.precio).toLocaleString('es-CL')}</td>
                      <td>{item.cantidad}</td>
                      <td className="text-end px-3 fw-bold text-success">${Number(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer border-secondary p-4 d-flex justify-content-between align-items-center">
              <span className="fs-5 fw-bold">Total Pagado:</span>
              <span className="fs-4 fw-bold text-success">${Number(totalPagar).toLocaleString('es-CL')}</span>
            </div>
          </div>

          
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/cuenta" className="btn btn-outline-light fw-bold px-4 py-2">Ver en Mis Compras</Link>
            <Link to="/" className="btn btn-success fw-bold px-4 py-2">Volver a la Tienda</Link>
          </div>

        </div>
      </div>
    </main>
  );
}