import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import Preventas from './pages/Preventas';
import Admin from './pages/Admin';
import MiCuenta from './pages/MiCuenta';
import Carrito from './pages/Carrito';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preventas" element={<Preventas />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cuenta" element={<MiCuenta />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/:plataforma" element={<Catalogo />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;