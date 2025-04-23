import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setFormError('');
    setIsLoading(true);
    
    const success = await register(email, password, nombre);
    
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
          <p>Crea una cuenta para comenzar</p>
        </div>
        
        {(error || formError) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="form-input"
              placeholder="Tu nombre"
            />
          </div>
          
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
              placeholder="Contraseña (mínimo 6 caracteres)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Repite tu contraseña"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>¿Ya tienes una cuenta? <button onClick={() => navigate('/login')} className="text-link">Inicia sesión</button></p>
        </div>
      </div>
      
      <div className="auth-info fade-in">
        <h2>Únete a la Comunidad de Patrones Espirituales</h2>
        <p>Al registrarte, tendrás acceso a herramientas diseñadas específicamente para apoyar tu proceso de ascensión espiritual.</p>
        <div className="auth-features">
          <div className="feature">
            <h3>Acceso Completo</h3>
            <p>Explora más de 500 patrones espirituales para tu desarrollo</p>
          </div>
          <div className="feature">
            <h3>Sincronización</h3>
            <p>Accede a tus patrones desde cualquier dispositivo</p>
          </div>
          <div className="feature">
            <h3>Comunidad</h3>
            <p>Forma parte de una comunidad dedicada a la ascensión espiritual</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
