import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbarcliente.css';
import banner from './img/bannerPetCare.png';
import "bootstrap/dist/js/bootstrap.bundle";

function Navbarcliente() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('refreshed');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-primary shadow-sm">
      <div className="container">
        <Link to={'/inicio'} className="navbar-brand">
          <img src={banner} alt="banner" width="350" height="100" className="d-inline-block align-text-top" />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav nav-underline ms-5 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link me-5" aria-current="page" to="/adoptar">Adoptar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link me-5" aria-current="page" to="/reportes">Reportes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link me-5" aria-current="page" to="/contactanos">Contactanos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link me-5" aria-current="page" to="/donaciones">Donaciones</Link>
            </li>
            <li className="nav-item dropdown me-5">
              <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Mi Perfil
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/configuracion">Configuración</Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbarcliente;
