import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  CircularProgress,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  MenuBook as MenuBookIcon,
  List as ListIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Componente de barra de navegación
const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderRadius: '16px 16px 0 0',
        background: 'rgba(30, 30, 30, 0.9)',
        backdropFilter: 'blur(10px)',
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
            <MenuBookIcon />
            <Typography variant="caption">Inicio</Typography>
          </Box>
        </IconButton>
        
        <IconButton color="primary" onClick={() => navigate('/patterns')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ListIcon />
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
            <AddIcon />
          </Box>
        </IconButton>
        
        <IconButton color="primary" onClick={() => navigate('/instructions')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MenuBookIcon />
            <Typography variant="caption">Guía</Typography>
          </Box>
        </IconButton>
        
        <IconButton color="primary" onClick={() => navigate('/profile')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PersonIcon />
            <Typography variant="caption">Perfil</Typography>
          </Box>
        </IconButton>
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPatrones: 0,
    patronesPersonalizados: 0,
    patronesCompletados: 0
  });
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
        
        // Obtener categorías únicas
        const categoriasUnicas = [...new Set(patrones.map(p => p.categoria))];
        
        // Contar patrones por categoría
        const categoriasConConteo = categoriasUnicas.map(cat => ({
          nombre: cat,
          cantidad: patrones.filter(p => p.categoria === cat).length
        }));
        
        // Ordenar por cantidad (descendente)
        categoriasConConteo.sort((a, b) => b.cantidad - a.cantidad);
        
        setCategorias(categoriasConConteo);
        
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Efecto de gradiente para el fondo
  const gradientBg = {
    background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
    minHeight: '100vh',
    paddingBottom: '80px' // Espacio para la barra de navegación
  };

  return (
    <Box sx={gradientBg}>
      <Container maxWidth="md" sx={{ pt: 4, pb: 10 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #9C27B0 30%, #CE93D8 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Portal de Patrones
          </Typography>
          
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Salir
          </Button>
        </Box>
        
        <Typography variant="h6" sx={{ mb: 3 }}>
          Bienvenido, {user?.nombre || 'Usuario'}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}>
                  <CardContent>
                    <Typography variant="h3" align="center" sx={{ mb: 1, color: '#CE93D8' }}>
                      {stats.totalPatrones}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      Patrones Totales
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}>
                  <CardContent>
                    <Typography variant="h3" align="center" sx={{ mb: 1, color: '#9C27B0' }}>
                      {stats.patronesPersonalizados}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      Patrones Personalizados
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}>
                  <CardContent>
                    <Typography variant="h3" align="center" sx={{ mb: 1, color: '#4A148C' }}>
                      {stats.patronesCompletados}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      Patrones Completados
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Acciones rápidas */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Acciones Rápidas
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/add-pattern')}
                  sx={{ 
                    py: 2,
                    background: 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)',
                  }}
                >
                  Añadir Patrón
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ListIcon />}
                  onClick={() => navigate('/patterns')}
                  sx={{ py: 2 }}
                >
                  Ver Todos
                </Button>
              </Grid>
            </Grid>
            
            {/* Categorías */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categorías
            </Typography>
            
            <Grid container spacing={2}>
              {categorias.slice(0, 6).map((categoria, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                  }}>
                    <CardActionArea 
                      onClick={() => navigate(`/patterns?categoria=${encodeURIComponent(categoria.nombre)}`)}
                      sx={{ p: 2 }}
                    >
                      <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                        {categoria.nombre}
                      </Typography>
                      <Typography variant="body2" align="center" color="textSecondary">
                        {categoria.cantidad} patrones
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
              
              {categorias.length > 6 && (
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="text"
                    color="primary"
                    onClick={() => navigate('/patterns')}
                    sx={{ mt: 1 }}
                  >
                    Ver todas las categorías
                  </Button>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Container>
      
      <Navbar />
    </Box>
  );
};

export default Dashboard;
