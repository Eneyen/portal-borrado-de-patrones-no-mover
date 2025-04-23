import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import './components/LanguageSelector.css';

// Componentes
import DashboardUsuario from './components/DashboardUsuario';
import PatternListUsuario from './components/PatternListUsuario';
import AddPatternUsuario from './components/AddPatternUsuario';
import Instructions from './components/Instructions';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import LanguageSelector from './components/LanguageSelector';

// Componente de login/registro
const Auth = () => {
  const [isLoginForm, setIsLoginForm] = React.useState(true);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  
  const { login, register, error } = useAuth();
  const { t } = useTranslation();

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar envío del formulario de login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email || !formData.password) {
      setAlertMessage(t('required_fields'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setAlertMessage(result.error || t('login_error'));
      } else {
        setAlertMessage(t('login_success'));
      }
    } catch (error) {
      setAlertMessage(t('login_error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar envío del formulario de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      setAlertMessage(t('required_fields'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setAlertMessage(t('passwords_not_match'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(formData.name, formData.email, formData.password);
      
      if (!result.success) {
        setAlertMessage(result.error || t('register_error'));
      } else {
        setAlertMessage(t('register_success'));
      }
    } catch (error) {
      setAlertMessage(t('register_error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar entre formularios de login y registro
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setAlertMessage('');
  };

  // Crear estrellas para el fondo cósmico
  const stars = Array.from({ length: 100 }).map((_, i) => (
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
  ));

  return (
    <div className="app">
      {/* Fondo cósmico */}
      <div className="cosmic-bg" id="stars">
        {stars}
      </div>
      
      {/* Selector de idioma */}
      <LanguageSelector />
      
      {/* Contenedor principal */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>{isLoginForm ? t('login_title') : t('register_title')}</h1>
            <p>
              {isLoginForm ? t('login_subtitle') : t('register_subtitle')}
            </p>
          </div>
          
          {/* Mensaje de alerta */}
          {(alertMessage || error) && (
            <div className="alert">
              <p>{alertMessage || error}</p>
              <button className="alert-button" onClick={() => setAlertMessage('')}>
                {t('accept')}
              </button>
            </div>
          )}
          
          {/* Formulario de login */}
          {isLoginForm ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">{t('email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  className="form-control" 
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t('password')}</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className="form-control" 
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? t('processing') : t('login_button')}
              </button>
            </form>
          ) : (
            /* Formulario de registro */
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label htmlFor="name">{t('name')}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  className="form-control" 
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t('email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  className="form-control" 
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t('password')}</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className="form-control" 
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">{t('confirm_password')}</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  className="form-control" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? t('processing') : t('register_button')}
              </button>
            </form>
          )}
          
          <div className="login-footer">
            <p>
              {isLoginForm 
                ? t('no_account') + ' ' 
                : t('have_account') + ' '}
              <a href="#" onClick={toggleForm}>
                {isLoginForm ? t('register_link') : t('login_link')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de barra de navegación
const Navbar = () => {
  const { t } = useTranslation();
  
  return (
    <div className="navbar">
      <div className="navbar-container">
        <a href="/dashboard" className="nav-item">
          <span>{t('home')}</span>
        </a>
        
        <a href="/patterns" className="nav-item">
          <span>{t('patterns')}</span>
        </a>
        
        <a href="/add-pattern" className="add-button">
          +
        </a>
        
        <a href="/instructions" className="nav-item">
          <span>{t('guide')}</span>
        </a>
        
        <a href="/profile" className="nav-item">
          <span>{t('profile')}</span>
        </a>
      </div>
    </div>
  );
};

// Componente de layout para rutas protegidas
const ProtectedLayout = ({ children }) => {
  return (
    <div className="app">
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
      
      {/* Selector de idioma */}
      <LanguageSelector />
      
      <div className="content-container">
        {children}
      </div>
      
      <Navbar />
    </div>
  );
};

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();
  
  if (loading) {
    return <div className="loading-screen">{t('processing')}</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

// Componente principal de la aplicación
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardUsuario />
            </ProtectedRoute>
          } />
          
          <Route path="/patterns" element={
            <ProtectedRoute>
              <PatternListUsuario />
            </ProtectedRoute>
          } />
          
          <Route path="/add-pattern" element={
            <ProtectedRoute>
              <AddPatternUsuario />
            </ProtectedRoute>
          } />
          
          <Route path="/instructions" element={
            <ProtectedRoute>
              <Instructions />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
