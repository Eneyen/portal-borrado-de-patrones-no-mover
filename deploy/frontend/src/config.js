// Archivo de configuración para el frontend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default {
  API_URL,
  endpoints: {
    login: `${API_URL}/usuarios/login`,
    registro: `${API_URL}/usuarios/registro`,
    verificar: `${API_URL}/usuarios/verificar`,
    cambiarPassword: `${API_URL}/usuarios/cambiar-password`,
    patrones: `${API_URL}/patrones`,
    categorias: `${API_URL}/patrones/categorias`,
    estadisticas: `${API_URL}/patrones/estadisticas`
  }
};
