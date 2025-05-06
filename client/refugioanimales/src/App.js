import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react';
import Register from './Register';
import Login from './Login';
import Inicio from './Inicio';
import Adoptar from './Adoptar';
import AgregarAnimal from './AgregarAnimal';
import VerMascota from './VerMascota';
import VerCliente from './VerCliente';
import Reportes from './Reportes';
import Contactanos from './Contactanos';
import Clientes from './Clientes';
import Donaciones from './Donaciones';
import Configuracion from './Configuracion';
import NuevoReporte from './NuevoReporte';
import ReporteAdopcion from './ReporteAdopcion';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

function App() {
    return (
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/inicio" element={<ProtectedRoute element={<Inicio />} />} />
                  <Route path="/adoptar" element={<ProtectedRoute element={<Adoptar />} />} />
                  <Route path="/agregaranimal" element={<ProtectedRoute element={<AgregarAnimal />} />} />
                  <Route path="/adoptar/:id" element={<ProtectedRoute element={<VerMascota />} />} />
                  <Route path="/reportes" element={<ProtectedRoute element={<Reportes />} />} />
                  <Route path="/nuevoreporte" element={<ProtectedRoute element={<NuevoReporte />} />} />
                  <Route path="/reporteadopcion" element={<ProtectedRoute element={<ReporteAdopcion />} />} />
                  <Route path="/contactanos" element={<ProtectedRoute element={<Contactanos />} />} />
                  <Route path="/clientes" element={<ProtectedRoute element={<Clientes />} />} />
                  <Route path="/clientes/:id" element={<ProtectedRoute element={<VerCliente />} />} />
                  <Route path="/donaciones" element={<ProtectedRoute element={<Donaciones />} />} />
                  <Route path="/configuracion" element={<ProtectedRoute element={<Configuracion />} />} />
              </Routes>
          </Router>
      </AuthProvider>
    );
}

export default App;
