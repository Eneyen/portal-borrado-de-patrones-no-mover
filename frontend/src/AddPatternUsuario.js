import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext-usuario';
import axios from 'axios';

const AddPatternUsuario = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'General'
  });
  const [categorias, setCategorias] = useState([
    'General', 'Abuso', 'Ansiedad', 'Depresión', 'Dinero', 
    'Relaciones', 'Alimentación', 'Ira', 'Autoridad', 'Belleza',
    'Edad', 'Problemas del cuerpo físico', 'Hablando tu verdad',
    'Aislamiento y exclusión', 'Ropa', 'Violación', 'Votos'
  ]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Configuración de axios
  const API_URL = process.env.REACT_APP_API_URL || 'https://bgzgmkya.manus.space/api';

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar cambio de categoría
  const handleCategoriaChange = (e) => {
    const value = e.target.value;
    if (value === 'nueva') {
      setMostrarNuevaCategoria(true);
    } else {
      setFormData({
        ...formData,
        categoria: value
      });
      setMostrarNuevaCategoria(false);
    }
  };

  // Manejar cambio en nueva categoría
  const handleNuevaCategoriaChange = (e) => {
    setNuevaCategoria(e.target.value);
  };

  // Añadir nueva categoría
  const handleAgregarCategoria = () => {
    if (nuevaCategoria.trim() === '') return;
    
    if (!categorias.includes(nuevaCategoria)) {
      setCategorias([...categorias, nuevaCategoria]);
    }
    
    setFormData({
      ...formData,
      categoria: nuevaCategoria
    });
    
    setNuevaCategoria('');
    setMostrarNuevaCategoria(false);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      setMensaje({ texto: 'El nombre del patrón es obligatorio', tipo: 'error' });
      return;
    }
    
    setCargando(true);
    
    try {
      const res = await axios.post(`${API_URL}/patrones`, formData);
      
      setMensaje({ 
        texto: 'Patrón añadido correctamente', 
        tipo: 'exito' 
      });
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: 'General'
      });
      
      setTimeout(() => {
        setMensaje({ texto: '', tipo: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error al añadir patrón:', error);
      setMensaje({ 
        texto: error.response?.data?.error || 'Error al añadir patrón', 
        tipo: 'error' 
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="add-pattern-container">
      <h2 className="section-title">Añadir Nuevo Patrón</h2>
      
      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="pattern-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Patrón *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Ej: Patrón de miedo al rechazo"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Describe el patrón y cómo se manifiesta en tu vida"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            value={mostrarNuevaCategoria ? 'nueva' : formData.categoria}
            onChange={handleCategoriaChange}
            className="form-control"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="nueva">+ Añadir nueva categoría</option>
          </select>
        </div>
        
        {mostrarNuevaCategoria && (
          <div className="form-group nueva-categoria">
            <label htmlFor="nuevaCategoria">Nueva Categoría</label>
            <div className="nueva-categoria-input">
              <input
                type="text"
                id="nuevaCategoria"
                value={nuevaCategoria}
                onChange={handleNuevaCategoriaChange}
                className="form-control"
                placeholder="Nombre de la nueva categoría"
              />
              <button 
                type="button" 
                onClick={handleAgregarCategoria}
                className="btn-small"
              >
                Añadir
              </button>
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn" 
          disabled={cargando}
        >
          {cargando ? 'Añadiendo...' : 'Añadir Patrón'}
        </button>
      </form>
      
      <div className="pattern-info">
        <h3>Sobre los Patrones Personalizados</h3>
        <p>
          Los patrones personalizados te permiten registrar patrones específicos que has identificado en tu proceso de ascensión espiritual.
        </p>
        <p>
          Estos patrones son privados y solo visibles para ti. Puedes marcarlos como completados una vez que hayas trabajado en ellos.
        </p>
        <p>
          Recuerda que el borrado de patrones es una técnica poderosa para liberar bloqueos energéticos y avanzar en tu proceso de ascensión.
        </p>
      </div>
    </div>
  );
};

export default AddPatternUsuario;
