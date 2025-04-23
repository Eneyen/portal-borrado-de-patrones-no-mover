const express = require('express');
const { Patron } = require('../models');
const { auth } = require('./auth-routes');

const router = express.Router();

// Obtener todos los patrones
router.get('/', auth, async (req, res) => {
  try {
    const patrones = await Patron.find({});
    res.json(patrones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener categorías de patrones
router.get('/categorias', auth, async (req, res) => {
  try {
    const categorias = await Patron.distinct('categoria');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener estadísticas de patrones
router.get('/estadisticas', auth, async (req, res) => {
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

// Obtener un patrón específico
router.get('/:id', auth, async (req, res) => {
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

// Crear un nuevo patrón
router.post('/', auth, async (req, res) => {
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

// Actualizar un patrón existente
router.put('/:id', auth, async (req, res) => {
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

// Eliminar un patrón
router.delete('/:id', auth, async (req, res) => {
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

module.exports = router;
