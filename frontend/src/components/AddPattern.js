import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import PatronesContext from '../context/PatronesContext';

const AddPattern = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'General'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { crearPatron } = useContext(PatronesContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Validación básica
      if (!formData.nombre.trim()) {
        throw new Error('El nombre del patrón es obligatorio');
      }
      
      const newPatron = await crearPatron(formData);
      
      if (newPatron) {
        setSuccess(true);
        setFormData({
          nombre: '',
          descripcion: '',
          categoria: 'General'
        });
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate(`/patrones/${newPatron._id}`);
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Error al crear el patrón');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="add-pattern-container fade-in">
        <div className="add-pattern-header">
          <h1>Añadir Nuevo Patrón</h1>
          <p>Crea un nuevo patrón personalizado para tu proceso de ascensión espiritual.</p>
        </div>
        
        <div className="card">
          {error && (
            <div className="error-message mb-3">
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message mb-3">
              Patrón creado correctamente. Redirigiendo...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="pattern-form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre del Patrón *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Ej: Liberación de patrones kármicos"
                disabled={isLoading || success}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="5"
                className="form-textarea"
                placeholder="Describe el propósito y proceso de este patrón..."
                disabled={isLoading || success}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="categoria" className="form-label">Categoría</label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: Sanación, Transformación, Ascensión..."
                disabled={isLoading || success}
              />
              <small className="form-help-text">Si dejas este campo vacío, se asignará a la categoría "General"</small>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/patrones')} 
                className="btn btn-outline"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn"
                disabled={isLoading || success}
              >
                {isLoading ? 'Creando...' : 'Crear Patrón'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="add-pattern-info card mt-3">
          <h3>¿Qué es un patrón personalizado?</h3>
          <p>
            Los patrones personalizados te permiten crear y seguir tus propios procesos de transformación 
            espiritual, complementando los patrones predefinidos del sistema.
          </p>
          <h3 className="mt-2">Consejos para crear patrones efectivos:</h3>
          <ul className="tips-list">
            <li>Utiliza nombres claros y descriptivos</li>
            <li>Incluye detalles sobre el propósito y proceso en la descripción</li>
            <li>Organiza tus patrones en categorías para facilitar su gestión</li>
            <li>Marca los patrones como completados cuando hayas finalizado su trabajo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddPattern;
