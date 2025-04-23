const mongoose = require('mongoose');

// Esquema para los patrones
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
  // Campo para asociar cada patrón con un usuario específico
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
});

// Esquema para los usuarios
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
  },
  // Estadísticas del usuario
  estadisticas: {
    patronesCompletados: {
      type: Number,
      default: 0
    },
    patronesPersonalizados: {
      type: Number,
      default: 0
    },
    ultimoAcceso: {
      type: Date,
      default: Date.now
    }
  }
});

// Exportar los modelos
module.exports = {
  PatronSchema,
  UsuarioSchema
};
