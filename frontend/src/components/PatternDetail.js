import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import PatronesContext from '../context/PatronesContext';

const PatternDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerPatron, actualizarPatron, eliminarPatron, loading } = useContext(PatronesContext);
  const [patron, setPatron] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    completado: false
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchPatron = async () => {
      const data = await obtenerPatron(id);
      if (data) {
        setPatron(data);
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          categoria: data.categoria,
          completado: data.completado
        });
      }
    };

    fetchPatron();
  }, [id, obtenerPatron]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPatron = await actualizarPatron(id, formData);
    if (updatedPatron) {
      setPatron(updatedPatron);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      const success = await eliminarPatron(id);
      if (success) {
        navigate('/patrones');
      }
    } else {
      setConfirmDelete(true);
      // Auto-reset confirmation after 5 seconds
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };

  const handleToggleComplete = async () => {
    const updatedData = {
      ...formData,
      completado: !formData.completado
    };
    
    const updatedPatron = await actualizarPatron(id, updatedData);
    if (updatedPatron) {
      setPatron(updatedPatron);
      setFormData({
        ...formData,
        completado: updatedPatron.completado
      });
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading"></div></div>;
  }

  if (!patron) {
    return (
      <div className="container">
        <div className="card">
          <h2>Patrón no encontrado</h2>
          <p>El patrón que buscas no existe o ha sido eliminado.</p>
          <button onClick={() => navigate('/patrones')} className="btn mt-2">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="pattern-detail-container fade-in">
        <div className="pattern-detail-header">
          <button onClick={() => navigate('/patrones')} className="back-button">
            ← Volver a la lista
          </button>
          
          <div className="pattern-actions">
            {patron.personalizado && (
              <>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="btn"
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
                
                <button 
                  onClick={handleDelete} 
                  className={`btn btn-danger ${confirmDelete ? 'btn-confirm' : ''}`}
                >
                  {confirmDelete ? '¿Confirmar eliminación?' : 'Eliminar'}
                </button>
              </>
            )}
            
            <button 
              onClick={handleToggleComplete} 
              className={`btn ${formData.completado ? 'btn-success' : 'btn-outline'}`}
            >
              {formData.completado ? 'Completado' : 'Marcar como completado'}
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="card">
            <h2>Editar Patrón</h2>
            <form onSubmit={handleSubmit} className="pattern-form">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="form-input"
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
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="completado"
                    checked={formData.completado}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  Marcar como completado
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="pattern-detail-content card">
            <div className="pattern-header">
              <h1 className="pattern-title">{patron.nombre}</h1>
              <div className="pattern-meta">
                <span className="pattern-category">{patron.categoria || 'General'}</span>
                {patron.personalizado && <span className="pattern-custom-badge">Personalizado</span>}
                {patron.completado && <span className="pattern-completed-badge">Completado</span>}
              </div>
            </div>
            
            <div className="pattern-body">
              <h3>Descripción</h3>
              <div className="pattern-description">
                {patron.descripcion ? (
                  <p>{patron.descripcion}</p>
                ) : (
                  <p className="no-description">No hay descripción disponible para este patrón.</p>
                )}
              </div>
            </div>
            
            <div className="pattern-footer">
              <div className="pattern-dates">
                <p>Creado: {new Date(patron.fechaCreacion).toLocaleDateString()}</p>
                {patron.fechaActualizacion && (
                  <p>Actualizado: {new Date(patron.fechaActualizacion).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternDetail;
