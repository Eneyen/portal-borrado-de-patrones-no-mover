import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon
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

const PatternDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patron, setPatron] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPatron = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/patrones/${id}`);
        setPatron(res.data);
      } catch (err) {
        setError('Error al cargar el patrón. Por favor, inténtalo de nuevo.');
        console.error('Error al obtener patrón:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatron();
  }, [id]);

  const handleToggleCompleted = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/patrones/${id}`, {
        ...patron,
        completado: !patron.completado
      });
      setPatron(res.data);
    } catch (err) {
      console.error('Error al actualizar patrón:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/patrones/${id}`);
      navigate('/patterns');
    } catch (err) {
      console.error('Error al eliminar patrón:', err);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patron) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)'
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error || 'Patrón no encontrado'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/patterns')}
          sx={{ mt: 2 }}
        >
          Volver a la lista
        </Button>
      </Box>
    );
  }

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
            Detalle del Patrón
          </Typography>
          
          {patron.personalizado && (
            <>
              <IconButton 
                color="primary" 
                onClick={() => navigate(`/edit-pattern/${id}`)}
                sx={{ ml: 1 }}
              >
                <EditIcon />
              </IconButton>
              
              <IconButton 
                color="error" 
                onClick={() => setOpenDialog(true)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
          
          <IconButton 
            color="primary" 
            onClick={handleToggleCompleted}
            sx={{ ml: 1 }}
          >
            {patron.completado ? <CheckCircleIcon /> : <UncheckedIcon />}
          </IconButton>
        </Box>
        
        {/* Contenido principal */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            mb: 4,
            background: patron.personalizado 
              ? 'linear-gradient(135deg, rgba(74, 20, 140, 0.2) 0%, rgba(30, 30, 30, 0.9) 100%)' 
              : 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{
                fontWeight: 600,
                color: patron.personalizado ? '#CE93D8' : 'white'
              }}
            >
              {patron.nombre}
            </Typography>
            
            <Box>
              <Chip 
                label={patron.categoria} 
                color="primary"
                sx={{ mr: 1 }}
              />
              
              {patron.personalizado && (
                <Chip 
                  label="Personalizado" 
                  color="secondary"
                />
              )}
              
              {patron.completado && (
                <Chip 
                  label="Completado" 
                  color="success"
                  icon={<CheckCircleIcon />}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
            {patron.descripcion || 'Este patrón no tiene descripción.'}
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" color="textSecondary">
              {patron.personalizado 
                ? 'Patrón personalizado creado por ti' 
                : 'Patrón original del documento de borrado de patrones'}
            </Typography>
          </Box>
        </Paper>
        
        {/* Acciones */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/patterns')}
            startIcon={<ArrowBackIcon />}
          >
            Volver a la lista
          </Button>
          
          <Button
            variant="contained"
            color={patron.completado ? "default" : "primary"}
            onClick={handleToggleCompleted}
            startIcon={patron.completado ? <UncheckedIcon /> : <CheckCircleIcon />}
            sx={{ 
              background: patron.completado 
                ? 'transparent' 
                : 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)'
            }}
          >
            {patron.completado ? 'Marcar como pendiente' : 'Marcar como completado'}
          </Button>
        </Box>
      </Container>
      
      <Navbar />
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Eliminar este patrón?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este patrón personalizado?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatternDetail;
