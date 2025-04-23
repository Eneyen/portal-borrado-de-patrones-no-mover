const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

module.exports = { Patron, Usuario };
