const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Configuración de dotenv
require('dotenv').config();

// Función para importar los patrones a MongoDB en memoria
const importarPatrones = async () => {
  let mongod;
  
  try {
    // Iniciar MongoDB en memoria
    console.log('Iniciando MongoDB en memoria...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(`MongoDB en memoria iniciado en: ${uri}`);
    
    // Conectar a MongoDB en memoria
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conexión a MongoDB establecida');
    
    // Definir esquema de Patron para pruebas
    const PatronSchema = new mongoose.Schema({
      nombre: {
        type: String,
        required: true,
        trim: true
      },
      descripcion: {
        type: String,
        required: false,
        default: ''
      },
      categoria: {
        type: String,
        required: false,
        default: 'General'
      },
      personalizado: {
        type: Boolean,
        default: false
      },
      completado: {
        type: Boolean,
        default: false
      },
      fechaCreacion: {
        type: Date,
        default: Date.now
      }
    });
    
    // Crear modelo
    const Patron = mongoose.model('Patron', PatronSchema);
    
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
    
    // Verificar que los patrones se hayan importado correctamente
    const totalPatrones = await Patron.countDocuments();
    console.log(`Total de patrones en la base de datos: ${totalPatrones}`);
    
    // Obtener categorías únicas
    const categoriasUnicas = await Patron.distinct('categoria');
    console.log(`Categorías encontradas: ${categoriasUnicas.length}`);
    console.log(categoriasUnicas);
    
    // Prueba de búsqueda
    const patronesMuestra = await Patron.find().limit(5);
    console.log('\nMuestra de patrones:');
    patronesMuestra.forEach(p => {
      console.log(`- ${p.nombre} (${p.categoria})`);
    });
    
    console.log('\nPrueba de importación completada con éxito');
    
  } catch (error) {
    console.error('Error durante la prueba de importación:', error);
  } finally {
    // Desconectar de MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Desconexión de MongoDB');
    }
    
    // Detener MongoDB en memoria
    if (mongod) {
      await mongod.stop();
      console.log('MongoDB en memoria detenido');
    }
  }
};

// Ejecutar la importación
importarPatrones();
