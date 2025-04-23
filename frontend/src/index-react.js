import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Componente principal de la aplicación
function App() {
  // Estado para controlar si se muestra el formulario de login o registro
  const [isLoginForm, setIsLoginForm] = React.useState(true);
  // Estado para los mensajes de alerta
  const [alertMessage, setAlertMessage] = React.useState('');
  // Estado para los datos del formulario
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar envío del formulario de login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email || !formData.password) {
      setAlertMessage('Por favor, completa todos los campos');
      return;
    }
    
    // Simulación de login exitoso
    setAlertMessage('Inicio de sesión exitoso. Redirigiendo al dashboard...');
    
    // En una implementación real, aquí se conectaría con el backend
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 2000);
  };

  // Manejar envío del formulario de registro
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      setAlertMessage('Por favor, completa todos los campos');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setAlertMessage('Las contraseñas no coinciden');
      return;
    }
    
    // Simulación de registro exitoso
    setAlertMessage('Registro exitoso. Redirigiendo al dashboard...');
    
    // En una implementación real, aquí se conectaría con el backend
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 2000);
  };

  // Alternar entre formularios de login y registro
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setAlertMessage('');
  };

  return (
    <div className="app">
      {/* Fondo cósmico */}
      <div className="cosmic-bg" id="stars">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Contenedor principal */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>{isLoginForm ? 'Portal de Patrones Espirituales' : 'Registro de Usuario'}</h1>
            <p>
              {isLoginForm 
                ? 'Accede para gestionar tus patrones de ascensión espiritual' 
                : 'Crea tu cuenta para acceder al portal'}
            </p>
          </div>
          
          {/* Mensaje de alerta */}
          {alertMessage && (
            <div className="alert">
              <p>{alertMessage}</p>
              <button className="alert-button" onClick={() => setAlertMessage('')}>Aceptar</button>
            </div>
          )}
          
          {/* Formulario de login */}
          {isLoginForm ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  className="form-control" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className="form-control" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <button type="submit" className="btn">Iniciar Sesión</button>
            </form>
          ) : (
            /* Formulario de registro */
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  className="form-control" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  className="form-control" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className="form-control" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  className="form-control" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <button type="submit" className="btn">Registrarse</button>
            </form>
          )}
          
          <div className="login-footer">
            <p>
              {isLoginForm 
                ? '¿No tienes una cuenta? ' 
                : '¿Ya tienes una cuenta? '}
              <a href="#" onClick={toggleForm}>
                {isLoginForm ? 'Regístrate' : 'Inicia Sesión'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Renderizar la aplicación
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
