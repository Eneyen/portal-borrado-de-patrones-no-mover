import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

export const PatronesContext = createContext();

export const PatronesProvider = ({ children }) => {
  const [patrones, setPatrones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalPatrones: 0,
    patronesPersonalizados: 0,
    patronesCompletados: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const cargarPatrones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(config.endpoints.patrones, getAuthHeaders());
      setPatrones(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar patrones:', error);
      setError('Error al cargar patrones');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const response = await axios.get(config.endpoints.categorias, getAuthHeaders());
      setCategorias(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(config.endpoints.estadisticas, getAuthHeaders());
      setEstadisticas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const obtenerPatron = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoints.patrones}/${id}`, getAuthHeaders());
      setError(null);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener patrón ${id}:`, error);
      setError('Error al obtener patrón');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearPatron = async (patronData) => {
    try {
      setLoading(true);
      const response = await axios.post(config.endpoints.patrones, patronData, getAuthHeaders());
      setPatrones([...patrones, response.data]);
      await cargarEstadisticas();
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error al crear patrón:', error);
      setError('Error al crear patrón');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const actualizarPatron = async (id, patronData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${config.endpoints.patrones}/${id}`, patronData, getAuthHeaders());
      
      setPatrones(patrones.map(patron => 
        patron._id === id ? response.data : patron
      ));
      
      await cargarEstadisticas();
      setError(null);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar patrón ${id}:`, error);
      setError('Error al actualizar patrón');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const eliminarPatron = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${config.endpoints.patrones}/${id}`, getAuthHeaders());
      
      setPatrones(patrones.filter(patron => patron._id !== id));
      await cargarEstadisticas();
      setError(null);
      return true;
    } catch (error) {
      console.error(`Error al eliminar patrón ${id}:`, error);
      setError('Error al eliminar patrón');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const marcarComoCompletado = async (id, completado) => {
    try {
      setLoading(true);
      const patron = patrones.find(p => p._id === id);
      if (!patron) {
        throw new Error('Patrón no encontrado');
      }
      
      const response = await axios.put(
        `${config.endpoints.patrones}/${id}`,
        { ...patron, completado },
        getAuthHeaders()
      );
      
      setPatrones(patrones.map(p => 
        p._id === id ? response.data : p
      ));
      
      await cargarEstadisticas();
      setError(null);
      return true;
    } catch (error) {
      console.error(`Error al marcar patrón ${id}:`, error);
      setError('Error al actualizar estado del patrón');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    patrones,
    categorias,
    estadisticas,
    loading,
    error,
    cargarPatrones,
    cargarCategorias,
    cargarEstadisticas,
    obtenerPatron,
    crearPatron,
    actualizarPatron,
    eliminarPatron,
    marcarComoCompletado
  };

  return <PatronesContext.Provider value={value}>{children}</PatronesContext.Provider>;
};

export default PatronesContext;
