import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import PatronesContext from '../context/PatronesContext';

const PatternList = () => {
  const { patrones, cargarPatrones, loading } = useContext(PatronesContext);
  const [filteredPatrones, setFilteredPatrones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    cargarPatrones();
  }, [cargarPatrones]);

  useEffect(() => {
    if (patrones.length > 0) {
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(patrones.map(patron => patron.categoria))].filter(Boolean);
      setCategories(uniqueCategories);
      
      // Aplicar filtros
      let filtered = [...patrones];
      
      if (searchTerm) {
        filtered = filtered.filter(patron => 
          patron.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patron.descripcion && patron.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (selectedCategory) {
        filtered = filtered.filter(patron => patron.categoria === selectedCategory);
      }
      
      if (!showCompleted) {
        filtered = filtered.filter(patron => !patron.completado);
      }
      
      setFilteredPatrones(filtered);
    }
  }, [patrones, searchTerm, selectedCategory, showCompleted]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleCompletedChange = (e) => {
    setShowCompleted(e.target.checked);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setShowCompleted(true);
  };

  return (
    <div className="container">
      <div className="patterns-container fade-in">
        <div className="patterns-header">
          <h1>Patrones Espirituales</h1>
          <p>Explora y gestiona tus patrones para el proceso de ascensión espiritual.</p>
        </div>
        
        <div className="filters-container card">
          <div className="filters-header">
            <h3>Filtros</h3>
            <button onClick={clearFilters} className="clear-filters-btn">Limpiar filtros</button>
          </div>
          
          <div className="filters-body">
            <div className="filter-group">
              <label htmlFor="search" className="filter-label">Buscar:</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por nombre o descripción"
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="category" className="filter-label">Categoría:</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={handleCompletedChange}
                  className="filter-checkbox"
                />
                Mostrar patrones completados
              </label>
            </div>
          </div>
        </div>
        
        <div className="patterns-actions">
          <Link to="/nuevo-patron" className="btn">Añadir Nuevo Patrón</Link>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading"></div>
          </div>
        ) : (
          <>
            <div className="patterns-stats">
              <p>Mostrando {filteredPatrones.length} de {patrones.length} patrones</p>
            </div>
            
            {filteredPatrones.length === 0 ? (
              <div className="no-patterns card">
                <h3>No se encontraron patrones</h3>
                <p>No hay patrones que coincidan con los filtros seleccionados.</p>
                <button onClick={clearFilters} className="btn mt-2">Limpiar filtros</button>
              </div>
            ) : (
              <div className="patterns-grid">
                {filteredPatrones.map(patron => (
                  <Link to={`/patrones/${patron._id}`} key={patron._id} className="pattern-link">
                    <div className={`pattern-card ${patron.completado ? 'completed' : ''}`}>
                      <div className="pattern-card__header">
                        <h3 className="pattern-card__title">{patron.nombre}</h3>
                        <span className="pattern-card__category">{patron.categoria || 'General'}</span>
                      </div>
                      
                      <div className="pattern-card__content">
                        {patron.descripcion ? (
                          <p className="pattern-card__description">
                            {patron.descripcion.length > 100 
                              ? `${patron.descripcion.substring(0, 100)}...` 
                              : patron.descripcion}
                          </p>
                        ) : (
                          <p className="pattern-card__no-description">Sin descripción</p>
                        )}
                      </div>
                      
                      <div className="pattern-card__footer">
                        {patron.personalizado && (
                          <span className="pattern-card__badge custom">Personalizado</span>
                        )}
                        {patron.completado && (
                          <span className="pattern-card__badge completed">Completado</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatternList;
