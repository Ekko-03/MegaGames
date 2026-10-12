import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const cargarCarrito = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/carrito/${userId}`);
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        setCarrito(data);
      } else {
        console.error("Error al obtener carrito:", data);
        setCarrito([]);
      }
    } catch (error) {
      console.error("Error de conexión al cargar carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem('megagames_user');
    if (!raw) {
      alert('Debes iniciar sesión para ver tu carrito');
      navigate('/login');
      return;
    }
    const user = JSON.parse(raw);
    setUsuario(user);
    const userId = user.id || user.id_usuario;
    cargarCarrito(userId);
  }, [navigate]);

  const handleEliminar = async (carritoId) => {
    try {
      const res = await fetch(`/api/carrito/${carritoId}`, { method: 'DELETE' });
      if (res.ok) {
        setCarrito(prev => prev.filter(item => item.carrito_id !== carritoId));
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleComprarTodo = async () => {
    try {
      const userId = usuario.id || usuario.id_usuario;
      const res = await fetch('/api/comprar-carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: userId })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.mensaje || '¡Compra realizada con éxito!');
        navigate('/cuenta');
      } else {
        alert(data.error || 'Hubo un error con la compra');
      }
    } catch (error) {
      console.error("Error al comprar:", error);
    }
  };

  const totalPagar = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  if (loading) return <div className="text-center text-white mt-5 fs-5">Cargando tu carrito...</div>;

  return (
    <main className="container-fluid px-4 px-lg-5 my-5">
      <h2 className="text-white fw-bold mb-4">🛒 Mi Carrito de Compras</h2>
      
      {carrito.length === 0 ? (
        <div className="alert alert-secondary text-dark text-center shadow-sm p-4">
          <h4 className="fw-bold">Tu carrito está vacío</h4>
          <p className="mb-3">¡Ve a ver nuestros juegos y agrega algo genial!</p>
          <Link to="/" className="btn btn-dark fw-bold">Ver Catálogo</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card text-bg-dark border-secondary shadow-sm">
              <div className="card-body p-0 table-responsive">
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr className="border-secondary text-secondary small text-uppercase">
                      <th className="px-3">Producto</th>
                      <th>Plataforma</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th className="text-end px-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.carrito_id} className="border-secondary">
                        <td className="px-3">
                          <div className="d-flex align-items-center gap-2">
                            <img src={item.imagen} alt={item.titulo} width="50" height="50" style={{ objectFit: 'cover', borderRadius: '5px' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
                            <span className="fw-bold">{item.titulo}</span>
                          </div>
                        </td>
                        <td><span className="badge bg-secondary text-uppercase">{item.plataforma}</span></td>
                        <td>{item.cantidad}</td>
                        <td className="text-success fw-bold">${Number(item.precio).toLocaleString('es-CL')}</td>
                        <td className="text-end px-3">
                          <button onClick={() => handleEliminar(item.carrito_id)} className="btn btn-sm btn-outline-danger">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card text-bg-dark border-secondary shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold border-bottom border-secondary pb-3">Resumen de Compra</h5>
                <div className="d-flex justify-content-between mb-3 mt-3">
                  <span className="text-light">Subtotal ({carrito.length} items)</span>
                  <span className="fw-bold">${Number(totalPagar).toLocaleString('es-CL')}</span>
                </div>
                <div className="d-flex justify-content-between mb-4 fs-5 border-top border-secondary pt-3">
                  <span className="fw-bold">Total a Pagar</span>
                  <span className="fw-bold text-success">${Number(totalPagar).toLocaleString('es-CL')}</span>
                </div>
                <button onClick={handleComprarTodo} className="btn btn-success w-100 fw-bold py-2 fs-5">
                  Confirmar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}