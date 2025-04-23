import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    setIsLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Patrones Espirituales</h1>
          <p>Inicia sesión para acceder a tu cuenta</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Tu contraseña"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>¿No tienes una cuenta? <button onClick={() => navigate('/register')} className="text-link">Regístrate</button></p>
        </div>
      </div>
      
      <div className="auth-info fade-in">
        <h2>Bienvenido al Portal de Patrones Espirituales</h2>
        <p>Esta plataforma está diseñada para ayudarte en tu proceso de ascensión espiritual, específicamente para usuarios que han completado la 6ª iniciación y están avanzando hacia la 7ª iniciación.</p>
        <div className="auth-features">
          <div className="feature">
            <h3>Gestión de Patrones</h3>
            <p>Accede a más de 500 patrones espirituales organizados por categorías</p>
          </div>
          <div className="feature">
            <h3>Seguimiento de Progreso</h3>
            <p>Marca patrones como completados y visualiza tu avance</p>
          </div>
          <div className="feature">
            <h3>Personalización</h3>
            <p>Añade tus propios patrones personalizados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
