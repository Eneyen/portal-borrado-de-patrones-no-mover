import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const token = localStorage.getItem('token');
    if (token) {
      verificarToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verificarToken = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(config.endpoints.verificar, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCurrentUser({
        ...response.data.usuario,
        token
      });
      setError(null);
    } catch (error) {
      console.error('Error al verificar token:', error);
      localStorage.removeItem('token');
      setCurrentUser(null);
      setError('Sesión expirada. Por favor inicie sesión nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(config.endpoints.login, {
        email,
        password
      });
      
      const { token, usuario } = response.data;
      localStorage.setItem('token', token);
      
      setCurrentUser({
        ...usuario,
        token
      });
      setError(null);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.response?.data?.error || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, nombre) => {
    try {
      setLoading(true);
      const response = await axios.post(config.endpoints.registro, {
        email,
        password,
        nombre
      });
      
      const { token, usuario } = response.data;
      localStorage.setItem('token', token);
      
      setCurrentUser({
        ...usuario,
        token
      });
      setError(null);
      return true;
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError(error.response?.data?.error || 'Error al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setError(null);
  };

  const cambiarPassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await axios.post(
        config.endpoints.cambiarPassword,
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }
      );
      
      setError(null);
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(error.response?.data?.error || 'Error al cambiar contraseña');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    cambiarPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
