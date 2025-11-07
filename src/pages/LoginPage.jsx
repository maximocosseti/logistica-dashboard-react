// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css'; // <-- 1. Importar el CSS (¡Esto estaba bien!)

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password); 
      navigate('/'); 
    } catch (err) {
      setError('Email o contraseña incorrectos. Inténtalo de nuevo.');
      console.error(err);
    }
  };

  // --- 2. ESTRUCTURA JSX CORREGIDA ---
  // (Usamos los 'className' de nuestro archivo CSS)
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Dashboard de Validación</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email (username)</label>
            <input 
              id="email" // 'htmlFor' de la label se conecta con 'id'
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: admin@example.com"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            Iniciar Sesión
          </button>
        </form>
        
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;