import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import PatronesContext from '../context/PatronesContext';

const OfflineMode = () => {
  const { patrones, loading, cargarPatrones } = useContext(PatronesContext);
  const [isOfflineEnabled, setIsOfflineEnabled] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState('');

  useEffect(() => {
    // Verificar si hay datos almacenados en localStorage
    const storedPatrones = localStorage.getItem('offline_patrones');
    if (storedPatrones) {
      setIsOfflineEnabled(true);
    }
    
    // Verificar si hay patrones cargados
    if (patrones.length === 0) {
      cargarPatrones();
    }
  }, [cargarPatrones, patrones.length]);

  const enableOfflineMode = () => {
    try {
      if (loading || patrones.length === 0) {
        setOfflineStatus('No hay patrones para almacenar offline o están cargando');
        return;
      }
      
      // Almacenar patrones en localStorage
      localStorage.setItem('offline_patrones', JSON.stringify(patrones));
      localStorage.setItem('offline_last_update', new Date().toISOString());
      
      setIsOfflineEnabled(true);
      setOfflineStatus('Modo offline activado. Los patrones están disponibles sin conexión.');
    } catch (error) {
      console.error('Error al activar modo offline:', error);
      setOfflineStatus(`Error al activar modo offline: ${error.message}`);
    }
  };

  const disableOfflineMode = () => {
    try {
      // Eliminar datos de localStorage
      localStorage.removeItem('offline_patrones');
      localStorage.removeItem('offline_last_update');
      
      setIsOfflineEnabled(false);
      setOfflineStatus('Modo offline desactivado.');
    } catch (error) {
      console.error('Error al desactivar modo offline:', error);
      setOfflineStatus(`Error al desactivar modo offline: ${error.message}`);
    }
  };

  const getLastUpdateTime = () => {
    const lastUpdate = localStorage.getItem('offline_last_update');
    if (lastUpdate) {
      return new Date(lastUpdate).toLocaleString();
    }
    return 'Nunca';
  };

  return (
    <div className="offline-container">
      <h3>Modo Offline</h3>
      <div className="offline-status">
        <p>Estado: {isOfflineEnabled ? 'Activado' : 'Desactivado'}</p>
        {isOfflineEnabled && (
          <p>Última actualización: {getLastUpdateTime()}</p>
        )}
      </div>
      <div className="offline-actions">
        {!isOfflineEnabled ? (
          <button 
            onClick={enableOfflineMode}
            disabled={loading || patrones.length === 0}
            className="enable-offline-button"
          >
            {loading ? 'Cargando...' : 'Activar Modo Offline'}
          </button>
        ) : (
          <button 
            onClick={disableOfflineMode}
            className="disable-offline-button"
          >
            Desactivar Modo Offline
          </button>
        )}
        {isOfflineEnabled && (
          <button 
            onClick={enableOfflineMode}
            disabled={loading}
            className="update-offline-button"
          >
            {loading ? 'Cargando...' : 'Actualizar Datos Offline'}
          </button>
        )}
      </div>
      {offlineStatus && <p className="offline-message">{offlineStatus}</p>}
    </div>
  );
};

export default OfflineMode;
