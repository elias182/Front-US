import React, { useState, useEffect } from 'react';
import './LoginComponent.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idRol, setIdRol] = useState('');
  const [roles, setRoles] = useState([]);
  const [registrado, setRegistrado] = useState(false);
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Simulando la obtención de roles desde la API
    
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    fetch('http://backend-us-production-8ae2.up.railway.app/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.datos) {
          setError(true);
        } else {
          setRegistrado(true);
        }
        setTimeout(() => {
          setRegistrado(false);
          setError(false);
        }, 5000);
      })
      .catch(error => console.error('Error registering user:', error));
  };

  return (
    <div>
      <div className="main">
        <div className="register">
          <form className="form" onSubmit={onSubmit}>
            <label>Registrate</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              name="txt"
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              name="email"
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              name="pswd"
              placeholder="Password"
              required
            />
            
            <button type="submit">Register</button>
          </form>
        </div>
      </div>

      <div className="all">
        {registrado && <h3>Registrado correctamente</h3>}
        {error && <h3>Datos erroneos, pruebe de nuevo</h3>}
      </div>

      <div className="contenedor">
        <div className="loop cubes" style={{ display: cargando ? 'block' : 'none' }}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className="item cubes"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
