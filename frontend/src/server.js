require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ruta principal para servir index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Conexión a MongoDB - Comentada para pruebas
// mongoose.connect('mongodb://localhost:27017/patrones_db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Conexión a MongoDB establecida'))
// .catch(err => console.error('Error al conectar a MongoDB:', err));

// Configuración para pruebas sin MongoDB
console.log('Modo de prueba: MongoDB desactivado para pruebas');

// Definición de esquemas
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
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  }
});

const UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: false,
    trim: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  rol: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  }
});

// Middleware para encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UsuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Crear modelos
const Patron = mongoose.model('Patron', PatronSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Middleware de autenticación
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    const usuario = await Usuario.findById(decoded.id);
    
    if (!usuario) {
      throw new Error();
    }
    
    req.token = token;
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Por favor autentíquese.' });
  }
};

// Rutas de autenticación
app.post('/api/usuarios/registro', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    
    console.log('Datos de registro recibidos:', { email, nombre });
    
    // Modo de prueba: Simular registro exitoso
    res.status(201).json({
      token: 'token_simulado_para_pruebas',
      usuario: {
        id: '12345',
        email: email,
        nombre: nombre,
        rol: 'usuario'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Datos de login recibidos:', { email });
    
    // Modo de prueba: Simular login exitoso
    res.json({
      token: 'token_simulado_para_pruebas',
      usuario: {
        id: '12345',
        email: email,
        nombre: 'Usuario de Prueba',
        rol: 'usuario'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para verificar token
app.get('/api/usuarios/verificar', auth, async (req, res) => {
  try {
    res.json({
      usuario: {
        id: req.usuario._id,
        email: req.usuario.email,
        nombre: req.usuario.nombre,
        rol: req.usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para cambiar contraseña
app.post('/api/usuarios/cambiar-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verificar contraseña actual
    const esCorrecta = await req.usuario.compararPassword(currentPassword);
    if (!esCorrecta) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }
    
    // Actualizar contraseña
    req.usuario.password = newPassword;
    await req.usuario.save();
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de patrones
app.get('/api/patrones', auth, async (req, res) => {
  try {
    const patrones = await Patron.find({});
    res.json(patrones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/patrones/categorias', auth, async (req, res) => {
  try {
    const categorias = await Patron.distinct('categoria');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/patrones/estadisticas', auth, async (req, res) => {
  try {
    const totalPatrones = await Patron.countDocuments();
    const patronesPersonalizados = await Patron.countDocuments({ personalizado: true, creadoPor: req.usuario._id });
    const patronesCompletados = await Patron.countDocuments({ completado: true });
    
    res.json({
      totalPatrones,
      patronesPersonalizados,
      patronesCompletados
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/patrones/:id', auth, async (req, res) => {
  try {
    const patron = await Patron.findById(req.params.id);
    if (!patron) {
      return res.status(404).json({ error: 'Patrón no encontrado' });
    }
    res.json(patron);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patrones', auth, async (req, res) => {
  try {
    const { nombre, descripcion, categoria } = req.body;
    
    const patron = new Patron({
      nombre,
      descripcion,
      categoria,
      personalizado: true,
      creadoPor: req.usuario._id
    });
    
    await patron.save();
    res.status(201).json(patron);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/patrones/:id', auth, async (req, res) => {
  try {
    const { nombre, descripcion, categoria, completado } = req.body;
    
    const patron = await Patron.findById(req.params.id);
    if (!patron) {
      return res.status(404).json({ error: 'Patrón no encontrado' });
    }
    
    // Solo permitir editar patrones personalizados o marcar como completados
    if (!patron.personalizado && (nombre !== patron.nombre || descripcion !== patron.descripcion || categoria !== patron.categoria)) {
      return res.status(403).json({ error: 'No se pueden modificar patrones predefinidos' });
    }
    
    patron.nombre = nombre || patron.nombre;
    patron.descripcion = descripcion || patron.descripcion;
    patron.categoria = categoria || patron.categoria;
    
    if (completado !== undefined) {
      patron.completado = completado;
    }
    
    await patron.save();
    res.json(patron);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/patrones/:id', auth, async (req, res) => {
  try {
    const patron = await Patron.findById(req.params.id);
    
    if (!patron) {
      return res.status(404).json({ error: 'Patrón no encontrado' });
    }
    
    // Solo permitir eliminar patrones personalizados
    if (!patron.personalizado) {
      return res.status(403).json({ error: 'No se pueden eliminar patrones predefinidos' });
    }
    
    await Patron.deleteOne({ _id: req.params.id });
    res.json({ mensaje: 'Patrón eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en 0.0.0.0:${PORT}`);
});

module.exports = { app, Patron, Usuario };
