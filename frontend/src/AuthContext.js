import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Configurar el token en los headers para todas las solicitudes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verificar si el token es válido haciendo una solicitud al backend
          const res = await axios.get('http://localhost:5000/api/usuarios/verificar');
          
          setUser(res.data.usuario);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Si hay un error, eliminar el token
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Función para verificar las preguntas de seguridad
  const verifySecurityQuestions = (answer1, answer2) => {
    // Normalizar las respuestas (eliminar espacios, convertir a minúsculas)
    const normalizedAnswer1 = answer1.trim().toLowerCase().replace('%', '');
    const normalizedAnswer2 = answer2.trim().toLowerCase();
    
    // Respuesta correcta para la pregunta 1: 30 o 30%
    const correctAnswer1 = '30';
    
    // Respuestas correctas para la pregunta 2 en diferentes idiomas
    const correctAnswers2 = {
      es: ['nueva zelanda'],
      en: ['new zealand'],
      fr: ['nouvelle-zélande', 'nouvelle zélande']
    };
    
    // Verificar la primera respuesta
    const isAnswer1Correct = normalizedAnswer1 === correctAnswer1;
    
    // Verificar la segunda respuesta en todos los idiomas
    const isAnswer2Correct = Object.values(correctAnswers2).flat().includes(normalizedAnswer2);
    
    // Ambas respuestas deben ser correctas
    return isAnswer1Correct && isAnswer2Correct;
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/usuarios/login', {
        email,
        password
      });
      
      // Guardar el token en localStorage
      localStorage.setItem('token', res.data.token);
      
      // Configurar el token en los headers para todas las solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data.usuario);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrarse
  const register = async (email, password, nombre) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/usuarios/registro', {
        email,
        password,
        nombre
      });
      
      // Guardar el token en localStorage
      localStorage.setItem('token', res.data.token);
      
      // Configurar el token en los headers para todas las solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data.usuario);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Eliminar el token de localStorage
    localStorage.removeItem('token');
    
    // Eliminar el token de los headers
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError,
        verifySecurityQuestions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
