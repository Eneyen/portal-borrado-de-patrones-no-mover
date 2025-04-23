import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { useContext } from 'react';
import PatronesContext from '../context/PatronesContext';

const ExportPatterns = () => {
  const { patrones, loading, cargarPatrones } = useContext(PatronesContext);
  const [exportFormat, setExportFormat] = useState('json');
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    if (patrones.length === 0) {
      cargarPatrones();
    }
  }, [cargarPatrones, patrones.length]);

  const handleExport = () => {
    if (loading || patrones.length === 0) {
      setExportStatus('No hay patrones para exportar o están cargando');
      return;
    }

    try {
      let content;
      let filename;
      let type;

      if (exportFormat === 'json') {
        content = JSON.stringify(patrones, null, 2);
        filename = 'patrones_exportados.json';
        type = 'application/json';
      } else if (exportFormat === 'csv') {
        // Crear encabezados CSV
        const headers = ['ID', 'Nombre', 'Descripción', 'Categoría', 'Personalizado', 'Completado', 'Fecha Creación'];
        
        // Convertir datos a filas CSV
        const rows = patrones.map(patron => [
          patron._id,
          patron.nombre,
          patron.descripcion,
          patron.categoria,
          patron.personalizado ? 'Sí' : 'No',
          patron.completado ? 'Sí' : 'No',
          new Date(patron.fechaCreacion).toLocaleDateString()
        ]);
        
        // Combinar encabezados y filas
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        
        content = csvContent;
        filename = 'patrones_exportados.csv';
        type = 'text/csv;charset=utf-8';
      } else {
        throw new Error('Formato de exportación no soportado');
      }

      // Crear blob y descargar archivo
      const blob = new Blob([content], { type });
      saveAs(blob, filename);
      
      setExportStatus(`Patrones exportados exitosamente en formato ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Error al exportar patrones:', error);
      setExportStatus(`Error al exportar: ${error.message}`);
    }
  };

  return (
    <div className="export-container">
      <h3>Exportar Patrones</h3>
      <div className="export-options">
        <div className="format-selector">
          <label>
            <input
              type="radio"
              value="json"
              checked={exportFormat === 'json'}
              onChange={() => setExportFormat('json')}
            />
            JSON
          </label>
          <label>
            <input
              type="radio"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={() => setExportFormat('csv')}
            />
            CSV
          </label>
        </div>
        <button 
          onClick={handleExport}
          disabled={loading || patrones.length === 0}
          className="export-button"
        >
          {loading ? 'Cargando...' : 'Exportar Patrones'}
        </button>
      </div>
      {exportStatus && <p className="export-status">{exportStatus}</p>}
    </div>
  );
};

export default ExportPatterns;
