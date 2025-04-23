const express = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const router = express.Router();

// Middleware de autenticación
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

// Ruta de registro
router.post('/registro', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    
    console.log('Datos de registro recibidos:', { email, nombre });
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Crear nuevo usuario
    const usuario = new Usuario({
      email,
      password,
      nombre,
      rol: 'usuario'
    });
    
    await usuario.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Datos de login recibidos:', { email });
    
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const esCorrecta = await usuario.compararPassword(password);
    if (!esCorrecta) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para verificar token
router.get('/verificar', auth, async (req, res) => {
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
router.post('/cambiar-password', auth, async (req, res) => {
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

module.exports = { router, auth };
