import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import axios from 'axios';

// Componente de barra de navegación (reutilizado)
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: 'rgba(30, 30, 30, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          p: 1
        }}
      >
        <IconButton color="primary" onClick={() => navigate('/dashboard')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption">Inicio</Typography>
          </Box>
        </IconButton>
        
        <IconButton color="primary" onClick={() => navigate('/patterns')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption">Patrones</Typography>
          </Box>
        </IconButton>
        
        <IconButton color="primary" onClick={() => navigate('/add-pattern')}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            background: 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)',
            borderRadius: '50%',
            p: 1,
            mt: -3,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
          }}>
            <Typography variant="caption">+</Typography>
          </Box>
        </IconButton>
        
        <IconButton color="primary" onClick={() => navigate('/instructions')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption">Guía</Typography>
          </Box>
        </IconButton>
        
        <IconButton color="primary" onClick={() => navigate('/profile')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption">Perfil</Typography>
          </Box>
        </IconButton>
      </Box>
    </Box>
  );
};

const AddPattern = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [categorias, setCategorias] = useState([
    'General', 'Abuso', 'Relaciones', 'Autoridad y poder', 'Ira', 
    'Votos', 'Patrones corporales', 'Dinero', 'Alimentación', 
    'Ansiedad', 'Depresión'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Cargar categorías existentes
  React.useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/patrones');
        const categoriasUnicas = [...new Set(res.data.map(p => p.categoria))];
        setCategorias(categoriasUnicas);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
      }
    };
    
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!nombre.trim()) {
      setError('El nombre del patrón es obligatorio');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/patrones', {
        nombre,
        descripcion,
        categoria
      });
      
      setSuccess(true);
      
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setCategoria('General');
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate(`/patterns/${res.data._id}`);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el patrón');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
      minHeight: '100vh',
      paddingBottom: '80px' // Espacio para la barra de navegación
    }}>
      <Container maxWidth="md" sx={{ pt: 4, pb: 10 }}>
        {/* Cabecera */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            color="primary" 
            onClick={() => navigate('/patterns')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography 
            variant="h5" 
            component="h1"
            sx={{
              fontWeight: 700,
              flexGrow: 1,
              background: 'linear-gradient(45deg, #9C27B0 30%, #CE93D8 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Añadir Nuevo Patrón
          </Typography>
        </Box>
        
        {/* Formulario */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            mb: 4,
            background: 'linear-gradient(135deg, rgba(74, 20, 140, 0.2) 0%, rgba(30, 30, 30, 0.9) 100%)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Patrón creado correctamente
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre del Patrón"
              fullWidth
              margin="normal"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />
            
            <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                label="Categoría"
                disabled={loading}
              >
                {categorias.map((cat, index) => (
                  <MenuItem key={index} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={6}
              margin="normal"
              variant="outlined"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/patterns')}
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Patrón'}
              </Button>
            </Box>
          </form>
        </Paper>
        
        {/* Información adicional */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 3,
            background: 'rgba(30, 30, 30, 0.7)',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            Consejos para crear patrones
          </Typography>
          
          <Typography variant="body2" paragraph>
            • Sé específico al nombrar el patrón para facilitar su identificación
          </Typography>
          
          <Typography variant="body2" paragraph>
            • Incluye en la descripción cómo se manifiesta este patrón en tu vida
          </Typography>
          
          <Typography variant="body2" paragraph>
            • Considera añadir afirmaciones o decretos que te ayuden a liberar este patrón
          </Typography>
          
          <Typography variant="body2">
            • Recuerda que puedes editar o eliminar tus patrones personalizados en cualquier momento
          </Typography>
        </Paper>
      </Container>
      
      <Navbar />
    </Box>
  );
};

export default AddPattern;
