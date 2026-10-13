import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  // Estados para el Checkout
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [formCheckout, setFormCheckout] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: '',
    comuna: '',
    indicaciones: ''
  });

  const cargarCarrito = async (userId) => {
    try {
      const res = await fetch(`/api/carrito/${userId}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCarrito(data);
      } else {
        setCarrito([]);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarRegiones = async () => {
    try {
      const res = await fetch('/api/regiones');
      const data = await res.json();
      setRegiones(data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarComunas = async (regionId) => {
    if (!regionId) return setComunas([]);
    try {
      const res = await fetch(`/api/comunas/${regionId}`);
      const data = await res.json();
      setComunas(data);
    } catch (err) {
      console.error(err);
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
    
    // Autocompletar 
    const [nombre, ...apellidosArr] = (user.nombre_completo || '').split(' ');
    setFormCheckout(prev => ({
      ...prev,
      nombre: nombre || '',
      apellidos: apellidosArr.join(' ') || '',
      correo: user.email || '',
      region: user.region_id || '',
      comuna: user.comuna_id || ''
    }));

    if (user.region_id) cargarComunas(user.region_id);

    cargarCarrito(userId);
    cargarRegiones();
  }, [navigate]);

  const handleChangeCheckout = (e) => {
    const { name, value } = e.target;
    setFormCheckout(prev => ({ ...prev, [name]: value }));
    
    if (name === 'region') {
      cargarComunas(value);
      setFormCheckout(prev => ({ ...prev, comuna: '' }));
    }
  };

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

  const handleComprarTodo = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Validar campos obligatorios
    if (!formCheckout.calle || !formCheckout.region || !formCheckout.comuna) {
      alert('Por favor completa la dirección de entrega (Calle, Región y Comuna).');
      return;
    }

    try {
      const userId = usuario.id || usuario.id_usuario;
      const res = await fetch('/api/comprar-carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: userId })
      });
      const data = await res.json();
      
      if (res.ok) {
        
        navigate('/pago-exitoso', { 
          state: { 
            orden: data, 
            cliente: formCheckout, 
            productos: carrito,
            totalPagar 
          } 
        });
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
      <h2 className="text-white fw-bold mb-4">Carrito de compra</h2>
      
      {carrito.length === 0 ? (
        <div className="alert alert-secondary text-dark text-center shadow-sm p-4">
          <h4 className="fw-bold">Tu carrito está vacío</h4>
          <p className="mb-3">¡Ve a ver nuestros juegos y agrega algo genial!</p>
          <Link to="/" className="btn btn-dark fw-bold">Ver Catálogo</Link>
        </div>
      ) : (
        <form onSubmit={handleComprarTodo} className="row g-4">
          <div className="col-lg-8">
            
            {/* Lista de Productos */}
            <div className="card text-bg-dark border-secondary shadow-sm mb-4">
              <div className="card-header py-3 px-4 border-secondary fw-bold">
                Completa la siguiente información
              </div>
              <div className="card-body p-0 table-responsive">
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr className="border-secondary text-secondary small text-uppercase">
                      <th className="px-3">Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th className="text-end px-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.carrito_id} className="border-secondary">
                        <td className="px-3">
                          <img src={item.imagen} alt={item.titulo} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/img/logo.png'; }} />
                        </td>
                        <td className="fw-semibold">{item.titulo}</td>
                        <td>${Number(item.precio).toLocaleString('es-CL')}</td>
                        <td>{item.cantidad}</td>
                        <td className="fw-bold text-success">${Number(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                        <td className="text-end px-3">
                          <button type="button" onClick={() => handleEliminar(item.carrito_id)} className="btn btn-sm btn-outline-danger">
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="card text-bg-dark border-secondary shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Información del cliente</h5>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary text-uppercase fw-bold">Nombre</label>
                    <input type="text" className="form-control" name="nombre" value={formCheckout.nombre} onChange={handleChangeCheckout} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary text-uppercase fw-bold">Apellidos</label>
                    <input type="text" className="form-control" name="apellidos" value={formCheckout.apellidos} onChange={handleChangeCheckout} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary text-uppercase fw-bold">Correo</label>
                  <input type="email" className="form-control" name="correo" value={formCheckout.correo} disabled />
                </div>
              </div>
            </div>

            {/* Dirección de Entrega */}
            <div className="card text-bg-dark border-secondary shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Dirección de entrega de los productos</h5>
                <p className="text-muted small mb-4">Ingrese dirección de forma detallada</p>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-8">
                    <label className="form-label small text-secondary text-uppercase fw-bold">Calle *</label>
                    <input type="text" className="form-control" name="calle" value={formCheckout.calle} onChange={handleChangeCheckout} required placeholder="Ej: Av. Providencia 123" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary text-uppercase fw-bold">Departamento (opcional)</label>
                    <input type="text" className="form-control" name="departamento" value={formCheckout.departamento} onChange={handleChangeCheckout} placeholder="Ej: Depto 603" />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary text-uppercase fw-bold">Región *</label>
                    <select className="form-select" name="region" value={formCheckout.region} onChange={handleChangeCheckout} required>
                      <option value="">Seleccione región...</option>
                      {regiones.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary text-uppercase fw-bold">Comuna *</label>
                    <select className="form-select" name="comuna" value={formCheckout.comuna} onChange={handleChangeCheckout} required disabled={!formCheckout.region}>
                      <option value="">Seleccione comuna...</option>
                      {comunas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary text-uppercase fw-bold">Indicaciones para la entrega (opcional)</label>
                  <textarea className="form-control" name="indicaciones" rows="2" value={formCheckout.indicaciones} onChange={handleChangeCheckout} placeholder="Ej: Entre calles, color del edificio, dejar en conserjería..."></textarea>
                </div>
              </div>
            </div>

          </div>

          <div className="col-lg-4">
            <div className="card text-bg-dark border-secondary shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-body p-4 text-center">
                <h5 className="fw-bold mb-4">Resumen</h5>
                
                <div className="d-flex justify-content-between mb-4 fs-5 border-top border-secondary pt-3">
                  <span className="fw-bold">Total a Pagar</span>
                  <span className="fw-bold text-success">${Number(totalPagar).toLocaleString('es-CL')}</span>
                </div>
                
                <button type="submit" className="btn btn-success w-100 fw-bold py-3 fs-5 shadow">
                  Pagar ahora ${Number(totalPagar).toLocaleString('es-CL')}
                </button>
                <small className="d-block text-muted mt-3">Al pagar aceptas nuestros términos de servicio.</small>
              </div>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}