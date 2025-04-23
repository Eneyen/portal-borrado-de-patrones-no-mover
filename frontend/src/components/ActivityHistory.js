import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import PatronesContext from '../context/PatronesContext';
import AuthContext from '../context/AuthContext';

const ActivityHistory = () => {
  const { currentUser } = useContext(AuthContext);
  const { patrones, loading, cargarPatrones } = useContext(PatronesContext);
  const [activityLog, setActivityLog] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (patrones.length === 0) {
      cargarPatrones();
    }
    
    // Cargar historial de actividad desde localStorage
    loadActivityHistory();
  }, [cargarPatrones, patrones.length]);

  const loadActivityHistory = () => {
    try {
      const storedHistory = localStorage.getItem('activity_history');
      if (storedHistory) {
        setActivityLog(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error al cargar historial de actividad:', error);
    }
  };

  const logActivity = (action, details) => {
    try {
      const newActivity = {
        timestamp: new Date().toISOString(),
        userId: currentUser?.id || 'unknown',
        userEmail: currentUser?.email || 'unknown',
        action,
        details
      };
      
      const storedHistory = localStorage.getItem('activity_history');
      let history = storedHistory ? JSON.parse(storedHistory) : [];
      
      // Añadir nueva actividad al principio del array
      history = [newActivity, ...history];
      
      // Limitar el historial a 100 entradas para evitar problemas de almacenamiento
      if (history.length > 100) {
        history = history.slice(0, 100);
      }
      
      localStorage.setItem('activity_history', JSON.stringify(history));
      setActivityLog(history);
    } catch (error) {
      console.error('Error al registrar actividad:', error);
    }
  };

  const clearHistory = () => {
    if (window.confirm('¿Estás seguro de que deseas borrar todo el historial de actividad?')) {
      localStorage.removeItem('activity_history');
      setActivityLog([]);
    }
  };

  const getFilteredActivities = () => {
    if (filter === 'all') {
      return activityLog;
    }
    return activityLog.filter(activity => activity.action === filter);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="activity-history-container">
      <h3>Historial de Actividad</h3>
      
      <div className="activity-filters">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="activity-filter-select"
        >
          <option value="all">Todas las actividades</option>
          <option value="login">Inicios de sesión</option>
          <option value="create">Creación de patrones</option>
          <option value="update">Actualización de patrones</option>
          <option value="delete">Eliminación de patrones</option>
          <option value="complete">Patrones completados</option>
        </select>
        
        <button 
          onClick={clearHistory}
          className="clear-history-button"
        >
          Borrar Historial
        </button>
      </div>
      
      {activityLog.length === 0 ? (
        <p className="no-activity">No hay actividades registradas</p>
      ) : (
        <div className="activity-list">
          {getFilteredActivities().map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-header">
                <span className="activity-time">{formatDate(activity.timestamp)}</span>
                <span className="activity-type">{activity.action}</span>
              </div>
              <div className="activity-user">{activity.userEmail}</div>
              <div className="activity-details">{activity.details}</div>
            </div>
          ))}
        </div>
      )}
      
      {/* Botones de ejemplo para registrar actividades (solo para demostración) */}
      <div className="demo-buttons" style={{marginTop: '20px', display: 'none'}}>
        <button onClick={() => logActivity('login', 'Usuario inició sesión')}>
          Simular Login
        </button>
        <button onClick={() => logActivity('create', 'Patrón "Ejemplo" creado')}>
          Simular Creación
        </button>
        <button onClick={() => logActivity('update', 'Patrón "Ejemplo" actualizado')}>
          Simular Actualización
        </button>
        <button onClick={() => logActivity('delete', 'Patrón "Ejemplo" eliminado')}>
          Simular Eliminación
        </button>
        <button onClick={() => logActivity('complete', 'Patrón "Ejemplo" marcado como completado')}>
          Simular Completado
        </button>
      </div>
    </div>
  );
};

export default ActivityHistory;
