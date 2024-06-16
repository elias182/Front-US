// LoginComponent.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css';

const LoginComponent = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate(); // Hook useNavigate para la navegación

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://backend-us-production-8ae2.up.railway.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token);
        navigate('/perfil'); // Navegar al perfil después de un inicio de sesión exitoso
      } else {
        setError(true);
        console.error('Login failed:', data);
      }
    } catch (error) {
      setError(true);
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="main">
      <div className="login">
        <form className="form" onSubmit={handleLogin}>
          <label>Log in</label>
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
          <button type="submit">Log in</button>
        </form>
        {error && <p>Login failed. Please try again.</p>}
      </div>
    </div>
  );
};

export default LoginComponent;
