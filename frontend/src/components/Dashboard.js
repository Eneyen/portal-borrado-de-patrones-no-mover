import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import PatronesContext from '../context/PatronesContext';
import ExportPatterns from './ExportPatterns';
import OfflineMode from './OfflineMode';
import ActivityHistory from './ActivityHistory';

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { estadisticas, cargarEstadisticas, loading } = useContext(PatronesContext);
  const [activeTab, setActiveTab] = useState('resumen');
  const navigate = useNavigate();

  React.useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">
          <h1>Patrones Espirituales</h1>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link active">Dashboard</Link>
          <Link to="/patrones" className="nav-link">Patrones</Link>
          <Link to="/nuevo-patron" className="nav-link">Añadir Patrón</Link>
          <Link to="/instrucciones" className="nav-link">Instrucciones</Link>
          <Link to="/perfil" className="nav-link">Perfil</Link>
          <button onClick={handleLogout} className="nav-link">Cerrar Sesión</button>
        </nav>
      </header>

      <main className="container">
        <div className="card fade-in">
          <h2>Bienvenido, {currentUser?.nombre || 'Usuario'}</h2>
          <p className="mb-2">Este es tu panel de control para gestionar los patrones espirituales relacionados con el proceso de ascensión.</p>
        </div>

        <div className="stats-container card fade-in">
          <h3>Estadísticas</h3>
          {loading ? (
            <div className="loading"></div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total de Patrones</h4>
                <p className="stat-value">{estadisticas.totalPatrones || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Patrones Personalizados</h4>
                <p className="stat-value">{estadisticas.patronesPersonalizados || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Patrones Completados</h4>
                <p className="stat-value">{estadisticas.patronesCompletados || 0}</p>
                <p className="stat-percentage">
                  {estadisticas.totalPatrones 
                    ? `(${Math.round((estadisticas.patronesCompletados / estadisticas.totalPatrones) * 100)}%)` 
                    : '(0%)'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="tools-container card fade-in">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'resumen' ? 'active' : ''}`}
              onClick={() => setActiveTab('resumen')}
            >
              Resumen
            </button>
            <button 
              className={`tab ${activeTab === 'exportar' ? 'active' : ''}`}
              onClick={() => setActiveTab('exportar')}
            >
              Exportar Patrones
            </button>
            <button 
              className={`tab ${activeTab === 'offline' ? 'active' : ''}`}
              onClick={() => setActiveTab('offline')}
            >
              Modo Offline
            </button>
            <button 
              className={`tab ${activeTab === 'actividad' ? 'active' : ''}`}
              onClick={() => setActiveTab('actividad')}
            >
              Historial de Actividad
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'resumen' && (
              <div className="tab-panel">
                <h3>Resumen de Progreso</h3>
                <p>Aquí puedes ver un resumen de tu progreso en el trabajo con los patrones espirituales.</p>
                <div className="progress-container mt-2">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${estadisticas.totalPatrones 
                          ? Math.round((estadisticas.patronesCompletados / estadisticas.totalPatrones) * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    Has completado {estadisticas.patronesCompletados || 0} de {estadisticas.totalPatrones || 0} patrones
                  </p>
                </div>
                <div className="actions mt-3">
                  <Link to="/patrones" className="btn">Ver Todos los Patrones</Link>
                  <Link to="/nuevo-patron" className="btn">Añadir Nuevo Patrón</Link>
                </div>
              </div>
            )}

            {activeTab === 'exportar' && (
              <div className="tab-panel">
                <ExportPatterns />
              </div>
            )}

            {activeTab === 'offline' && (
              <div className="tab-panel">
                <OfflineMode />
              </div>
            )}

            {activeTab === 'actividad' && (
              <div className="tab-panel">
                <ActivityHistory />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Patrones Espirituales - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Dashboard;
