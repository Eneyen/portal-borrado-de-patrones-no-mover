import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
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

const Profile = () => {
  const { user, logout } = React.useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPatrones: 0,
    patronesPersonalizados: 0,
    patronesCompletados: 0
  });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas
        const res = await axios.get('http://localhost:5000/api/patrones');
        const patrones = res.data;
        
        // Calcular estadísticas
        const totalPatrones = patrones.length;
        const patronesPersonalizados = patrones.filter(p => p.personalizado).length;
        const patronesCompletados = patrones.filter(p => p.completado).length;
        
        setStats({
          totalPatrones,
          patronesPersonalizados,
          patronesCompletados
        });
        
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleChangePassword = async () => {
    // Validación básica
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      // Llamada a la API para cambiar contraseña
      await axios.post('http://localhost:5000/api/usuarios/cambiar-password', {
        currentPassword,
        newPassword
      });
      
      setSuccess('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
      minHeight: '100vh',
      paddingBottom: '80px' // Espacio para la barra de navegación
    }}>
      <Container maxWidth="md" sx={{ pt: 4, pb: 10 }}>
        {/* Cabecera */}
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #9C27B0 30%, #CE93D8 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}
        >
          Mi Perfil
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {/* Información del usuario */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            mb: 4,
            background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#4A148C',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            
            <Box sx={{ ml: 3 }}>
              <Typography variant="h5" gutterBottom>
                {user?.nombre || 'Usuario'}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                {user?.email || 'correo@ejemplo.com'}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LockIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Cambiar Contraseña
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Paper>
        
        {/* Estadísticas */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mis Estadísticas
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 3,
              mb: 4
            }}
          >
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                borderRadius: 2
              }}
            >
              <Typography variant="h3" sx={{ color: '#CE93D8', mb: 1 }}>
                {stats.totalPatrones}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Patrones Totales
              </Typography>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                borderRadius: 2
              }}
            >
              <Typography variant="h3" sx={{ color: '#9C27B0', mb: 1 }}>
                {stats.patronesPersonalizados}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Patrones Personalizados
              </Typography>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                borderRadius: 2
              }}
            >
              <Typography variant="h3" sx={{ color: '#4A148C', mb: 1 }}>
                {stats.patronesCompletados}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Patrones Completados
              </Typography>
            </Paper>
          </Box>
        )}
        
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
            Sobre el Portal de Patrones
          </Typography>
          
          <Typography variant="body2" paragraph>
            Este portal está diseñado para ayudarte en tu proceso de ascensión espiritual, 
            permitiéndote gestionar y trabajar con los patrones que necesitas liberar para 
            avanzar hacia la 7ª iniciación.
          </Typography>
          
          <Typography variant="body2">
            Recuerda que el borrado de patrones es un proceso personal y sagrado. 
            Utiliza esta herramienta como apoyo en tu camino espiritual.
          </Typography>
        </Paper>
      </Container>
      
      <Navbar />
      
      {/* Diálogo para cambiar contraseña */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Para cambiar tu contraseña, introduce tu contraseña actual y la nueva contraseña.
          </DialogContentText>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            label="Contraseña Actual"
            type="password"
            fullWidth
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          
          <TextField
            label="Nueva Contraseña"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          
          <TextField
            label="Confirmar Nueva Contraseña"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleChangePassword} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
