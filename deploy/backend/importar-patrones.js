const mongoose = require('mongoose');
const { Patron } = require('./server');
const fs = require('fs');
const path = require('path');

// Configuración de dotenv
require('dotenv').config();

// Función para importar los patrones desde el archivo JSON
const importarPatrones = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/patrones_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conexión a MongoDB establecida');
    
    // Leer el archivo JSON de patrones
    const rutaArchivo = path.join(__dirname, '../data/patrones.json');
    const patronesData = JSON.parse(fs.readFileSync(rutaArchivo, 'utf8'));
    
    console.log(`Se encontraron ${patronesData.length} patrones para importar`);
    
    // Categorizar patrones basados en el primer patrón que contiene la tabla de contenidos
    const categorias = {};
    if (patronesData.length > 0 && patronesData[0].nombre === "Tabla de contenidos") {
      const lineas = patronesData[0].descripcion.split('\n');
      let categoriaActual = "General";
      
      for (const linea of lineas) {
        if (linea.trim() && !linea.includes('Borrar patrones') && !linea.includes('Técnica para borrar') && !linea.includes('Preguntas y respuestas')) {
          categoriaActual = linea.trim();
          categorias[categoriaActual] = [];
        }
      }
    }
    
    // Asignar categorías a patrones basados en su contenido o posición
    let categoriaActual = "General";
    for (let i = 1; i < patronesData.length; i++) {
      const patron = patronesData[i];
      
      // Intentar determinar la categoría
      for (const cat in categorias) {
        if (patron.nombre.includes(cat) || (patron.descripcion && patron.descripcion.includes(cat))) {
          categoriaActual = cat;
          break;
        }
      }
      
      // Asignar la categoría actual
      patron.categoria = categoriaActual;
    }
    
    // Verificar si ya existen patrones en la base de datos
    const patronesExistentes = await Patron.countDocuments();
    
    if (patronesExistentes > 0) {
      console.log(`Ya existen ${patronesExistentes} patrones en la base de datos. Omitiendo importación.`);
    } else {
      // Insertar patrones con categorías
      let contador = 0;
      for (const patron of patronesData) {
        await Patron.create({
          nombre: patron.nombre,
          descripcion: patron.descripcion || '',
          categoria: patron.categoria || 'General',
          personalizado: false
        });
        contador++;
        
        if (contador % 50 === 0) {
          console.log(`Importados ${contador} patrones...`);
        }
      }
      
      console.log(`Patrones importados correctamente: ${contador} patrones`);
    }
    
    // Desconectar de MongoDB
    await mongoose.disconnect();
    console.log('Desconexión de MongoDB');
    
  } catch (error) {
    console.error('Error al importar patrones:', error);
  }
};

// Ejecutar la importación
importarPatrones();
