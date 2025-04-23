import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext-usuario';

const DashboardUsuario = () => {
  const { usuario, token } = useAuth();
  const [estadisticas, setEstadisticas] = useState({
    totalPatrones: 0,
    patronesPersonalizados: 0,
    patronesCompletados: 0,
    totalCategorias: 0
  });
  const [patronesRecientes, setPatronesRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Configuración de axios
  const API_URL = process.env.REACT_APP_API_URL || 'https://bgzgmkya.manus.space/api';

  // Cargar estadísticas del usuario
  useEffect(() => {
    const cargarEstadisticas = async () => {
      if (!token) return;

      try {
        setCargando(true);
        const res = await axios.get(`${API_URL}/patrones/estadisticas`);
        setEstadisticas(res.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar estadísticas. Por favor, intenta de nuevo.');
        setCargando(false);
      }
    };

    cargarEstadisticas();
  }, [token]);

  // Cargar patrones recientes del usuario
  useEffect(() => {
    const cargarPatronesRecientes = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/patrones?limit=3`);
        setPatronesRecientes(res.data.slice(0, 3)); // Asegurar que solo tomamos 3 patrones
      } catch (error) {
        console.error('Error al cargar patrones recientes:', error);
      }
    };

    cargarPatronesRecientes();
  }, [token]);

  // Marcar patrón como completado/no completado
  const toggleCompletado = async (id, completado) => {
    try {
      await axios.put(`${API_URL}/patrones/${id}`, { completado: !completado });
      
      // Actualizar estado local
      setPatronesRecientes(patronesRecientes.map(p => 
        p._id === id ? { ...p, completado: !completado } : p
      ));
      
      // Actualizar estadísticas
      setEstadisticas({
        ...estadisticas,
        patronesCompletados: completado 
          ? estadisticas.patronesCompletados - 1 
          : estadisticas.patronesCompletados + 1
      });
    } catch (error) {
      console.error('Error al actualizar patrón:', error);
      setError('Error al actualizar patrón. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Portal de Patrones Espirituales</h1>
        <div className="user-info">
          <span className="user-name">Bienvenido, {usuario?.nombre || 'Usuario'}</span>
        </div>
      </div>
      
      {cargando ? (
        <div className="loading">Cargando estadísticas...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{estadisticas.totalPatrones}</div>
              <div className="stat-label">Patrones Totales</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{estadisticas.totalCategorias}</div>
              <div className="stat-label">Categorías</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{estadisticas.patronesCompletados}</div>
              <div className="stat-label">Patrones Completados</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{estadisticas.patronesPersonalizados}</div>
              <div className="stat-label">Patrones Personalizados</div>
            </div>
          </div>
          
          <div className="patterns-section">
            <h2 className="section-title">Patrones Recientes</h2>
            
            {patronesRecientes.length === 0 ? (
              <div className="empty-message">No hay patrones recientes para mostrar.</div>
            ) : (
              <div className="patterns-grid">
                {patronesRecientes.map(patron => (
                  <div 
                    key={patron._id} 
                    className={`pattern-card ${patron.personalizado ? 'custom' : ''} ${patron.completado ? 'completed' : ''}`}
                  >
                    <span className="pattern-category">{patron.categoria}</span>
                    <h3>{patron.nombre}</h3>
                    <p>{patron.descripcion}</p>
                    <div className="pattern-actions">
                      <button 
                        className="btn btn-small"
                        onClick={() => toggleCompletado(patron._id, patron.completado)}
                      >
                        {patron.completado ? 'Marcar como Pendiente' : 'Marcar como Completado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardUsuario;
