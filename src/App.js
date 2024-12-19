import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Paginas/Login';
import Inicio from './Paginas/Inicio';
import InicioAnalistas from './Paginas/InicioAnalistas';
import RegistroAnalista from './Paginas/registroAnalista';
import RegistroPrestamo from './Paginas/registroPrestamo';
import MantenimientoCliente from './Paginas/mantenimientoClientes';
import MantenimientoAnalistas from './Paginas/mantenimientoAnalistas';
import MantenimientoFormalizacion from './Paginas/mantenimientoFormalizacion';
import Informacion from './Paginas/Informacion';
import generarPdfFormalizacionPrestamos from './Paginas/pdfFormalizacionPrestamos';
import GestionClientes from './Paginas/mantenimientoClientes';
import FormalizacionPrestamos from './Paginas/formalizacionPrestamos';
import Navbar from './componentes/Navbar';
import Footer from './componentes/Footer';
import Prestamos from './Paginas/Prestamos';
import RealizarPago from './Paginas/RealizarPago';
import Pagos from './Paginas/Pagos';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './context/authContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/InicioAnalistas" element={<InicioAnalistas />} />
          <Route path="/IniciarSesion" element={<Login />} />

          {/* Rutas protegidas para clientes */}
          <Route element={<ProtectedRoute roles={['cliente']} />}>
            <Route path="/MisPrestamos" element={<Prestamos />} />
            <Route path="/RealizarPago" element={<RealizarPago />} />
            <Route path="/MisPagos" element={<Pagos />} />
          </Route>

          {/* Rutas protegidas para analistas */}
          <Route element={<ProtectedRoute roles={['analista']} />}>
            <Route path="/mantenimientoClientes" element={<MantenimientoCliente />} />
            <Route path="/mantenimientoAnalistas" element={<MantenimientoAnalistas />} />
            <Route path="/mantenimientoFormalizacion" element={<MantenimientoFormalizacion />} />
            <Route path="/RegistroAnalista" element={<RegistroAnalista />} />
            <Route path="/GestionClientes" element={<GestionClientes />} />
            <Route path="/formalizacionPrestamos" element={<FormalizacionPrestamos />} />
            <Route path="/pdfFormalizacion" element={<generarPdfFormalizacionPrestamos />} />
          </Route>

          {/* Rutas compartidas */}
          <Route element={<ProtectedRoute roles={['cliente', 'analista']} />}>
            <Route path="/RegistroPrestamo" element={<RegistroPrestamo />} />
            <Route path="/Informacion" element={<Informacion />} />
          </Route>
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
