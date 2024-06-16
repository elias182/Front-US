import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { AuthContext } from './AuthContext';
import './Header.css';

function Header() {
  const { isAuthenticated, userProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  return (
    <div className="header">
      <div className="login-register">
        {isAuthenticated ? (
          <div className="login-register">
            <img 
              src={`https://backend-us-production-8ae2.up.railway.app/${userProfile?.foto}` || `${process.env.PUBLIC_URL}/avatar_placeholder.jpg`} 
              alt="Avatar" 
              className="avatar" 
              onClick={handleProfileClick}
              style={{ cursor: 'pointer' }} // Cambia el cursor para indicar que es clickeable
            />
            <span>{userProfile?.name}</span>
            <button onClick={logout} className="cta1">
              <span>Log-Out</span>
              <svg width="15px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </button>
          </div>
        ) : (
          <>
            <img src={`${process.env.PUBLIC_URL}/avatar_placeholder.jpg`} alt="Avatar Placeholder" className="avatar" />
            <NavLink to="/login" className="login-link">
              <button className="cta1">
                <span>Log-In</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
              </button>
            </NavLink>
            <NavLink to="/register" className="login-link">
              <button className="cta">
                <span>Register</span>
              </button>
            </NavLink>
          </>
        )}
      </div>
      {/* Otros elementos del header */}
    </div>
  );
}

export default Header;
