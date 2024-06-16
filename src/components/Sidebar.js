import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Cambiar useHistory por useNavigate
import { FaHome, FaSearch, FaBook, FaPlus } from 'react-icons/fa';
import { AuthContext } from './AuthContext'; // Importar el contexto de autenticación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMusic } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

function Sidebar() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // Usar useNavigate

  const handleProtectedClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login'); // Usar navigate en lugar de history.push
    }
  };

  return (
    <div className="sidebar">
        <picture>
          {/* Formato WebP para navegadores modernos */}
          <source srcSet={`${process.env.PUBLIC_URL}/LOGO.webp`} type="image/webp" />

          {/* Formato PNG para navegadores antiguos */}
          <img className="logo" class="PRIM" src={`${process.env.PUBLIC_URL}/LOGO.png`} alt="Logo" />
        </picture>
      
      <NavLink to="/" activeClassName="active">
        <FaHome className="icon" />
        <span className="link-text">Inicio</span>
      </NavLink>
      <NavLink to="/buscar" activeClassName="active">
        <FaSearch className="icon" />
        <span className="link-text">Buscar</span>
      </NavLink>
      <NavLink to="/biblioteca" activeClassName="active" onClick={(e) => handleProtectedClick(e, '/library')}>
        <FaBook className="icon" />
        <span className="link-text">Biblioteca</span>
      </NavLink>
      <NavLink to="/add-cancion" activeClassName="active" onClick={(e) => handleProtectedClick(e, '/add-cancion')}>
      <div style={{ position: 'relative', display: 'inline-block', width: '24px', height: '24px' }}>
      <FontAwesomeIcon icon={faMusic} style={{ fontSize: '24px' }} />
      <FontAwesomeIcon 
        icon={faPlusCircle} 
        style={{
          position: 'absolute',
          bottom: '-4px',
          right: '-6px',
          fontSize: '15px',
        }} 
      />
    </div>
        <span className="link-text">Añadir Cancion</span>
      </NavLink>
    </div>
  );
}

export default Sidebar;
