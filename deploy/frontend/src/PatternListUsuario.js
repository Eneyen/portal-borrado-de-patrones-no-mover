import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext-usuario';

// Componente para listar patrones por usuario
const PatternListUsuario = () => {
  const { usuario, token } = useAuth();
  const [patrones, setPatrones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: 'todas',
    busqueda: '',
    completado: 'todos',
    personalizado: 'todos'
  });

  // Configuración de axios
  const API_URL = process.env.REACT_APP_API_URL || 'https://bgzgmkya.manus.space/api';

  // Cargar patrones del usuario autenticado
  useEffect(() => {
    const cargarPatrones = async () => {
      if (!token) return;

      try {
        setCargando(true);
        
        // Construir query string para filtros
        const params = new URLSearchParams();
        if (filtros.categoria !== 'todas') {
          params.append('categoria', filtros.categoria);
        }
        if (filtros.busqueda) {
          params.append('busqueda', filtros.busqueda);
        }
        if (filtros.completado !== 'todos') {
          params.append('completado', filtros.completado === 'completados');
        }
        if (filtros.personalizado !== 'todos') {
          params.append('personalizado', filtros.personalizado === 'personalizados');
        }

        const res = await axios.get(`${API_URL}/patrones?${params.toString()}`);
        setPatrones(res.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar patrones:', error);
        setError('Error al cargar patrones. Por favor, intenta de nuevo.');
        setCargando(false);
      }
    };

    cargarPatrones();
  }, [token, filtros]);

  // Cargar categorías disponibles para el usuario
  useEffect(() => {
    const cargarCategorias = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/patrones/categorias`);
        setCategorias(res.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    cargarCategorias();
  }, [token]);

  // Manejar cambio de filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  // Manejar búsqueda
  const handleBusqueda = (e) => {
    e.preventDefault();
    // La búsqueda ya se maneja en el useEffect con los filtros
  };

  // Marcar patrón como completado/no completado
  const toggleCompletado = async (id, completado) => {
    try {
      await axios.put(`${API_URL}/patrones/${id}`, { completado: !completado });
      
      // Actualizar estado local
      setPatrones(patrones.map(p => 
        p._id === id ? { ...p, completado: !completado } : p
      ));
    } catch (error) {
      console.error('Error al actualizar patrón:', error);
      setError('Error al actualizar patrón. Por favor, intenta de nuevo.');
    }
  };

  // Renderizar componente
  return (
    <div className="patterns-container">
      <h2 className="section-title">Mis Patrones</h2>
      
      {/* Filtros */}
      <div className="filters-container">
        <form onSubmit={handleBusqueda} className="search-form">
          <input
            type="text"
            name="busqueda"
            value={filtros.busqueda}
            onChange={handleFiltroChange}
            placeholder="Buscar patrones..."
            className="search-input"
          />
          <button type="submit" className="search-button">Buscar</button>
        </form>
        
        <div className="filter-options">
          <select 
            name="categoria" 
            value={filtros.categoria} 
            onChange={handleFiltroChange}
            className="filter-select"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select 
            name="completado" 
            value={filtros.completado} 
            onChange={handleFiltroChange}
            className="filter-select"
          >
            <option value="todos">Todos los patrones</option>
            <option value="completados">Completados</option>
            <option value="pendientes">Pendientes</option>
          </select>
          
          <select 
            name="personalizado" 
            value={filtros.personalizado} 
            onChange={handleFiltroChange}
            className="filter-select"
          >
            <option value="todos">Todos los tipos</option>
            <option value="personalizados">Personalizados</option>
            <option value="predefinidos">Predefinidos</option>
          </select>
        </div>
      </div>
      
      {/* Estado de carga */}
      {cargando ? (
        <div className="loading">Cargando patrones...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : patrones.length === 0 ? (
        <div className="empty-message">No se encontraron patrones con los filtros seleccionados.</div>
      ) : (
        /* Lista de patrones */
        <div className="patterns-grid">
          {patrones.map(patron => (
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
  );
};

export default PatternListUsuario;
