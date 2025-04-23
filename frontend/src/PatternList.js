import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

// Componente de barra de navegación (reutilizado del Dashboard)
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

const PatternList = () => {
  const [patrones, setPatrones] = useState([]);
  const [filteredPatrones, setFilteredPatrones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener categoría de la URL si existe
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaParam = params.get('categoria');
    if (categoriaParam) {
      setSelectedCategoria(categoriaParam);
    }
  }, [location]);

  // Cargar patrones
  useEffect(() => {
    const fetchPatrones = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/patrones');
        setPatrones(res.data);
        
        // Extraer categorías únicas
        const categoriasUnicas = [...new Set(res.data.map(p => p.categoria))];
        setCategorias(categoriasUnicas);
        
      } catch (error) {
        console.error('Error al obtener patrones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatrones();
  }, []);
  
  // Filtrar patrones
  useEffect(() => {
    let result = patrones;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrar por categoría
    if (selectedCategoria) {
      result = result.filter(p => p.categoria === selectedCategoria);
    }
    
    // Filtrar por completados
    if (!showCompleted) {
      result = result.filter(p => !p.completado);
    }
    
    // Calcular total de páginas
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    
    // Aplicar paginación
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResult = result.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredPatrones(paginatedResult);
  }, [patrones, searchTerm, selectedCategoria, showCompleted, page]);
  
  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Manejar clic en patrón
  const handlePatternClick = (id) => {
    navigate(`/patterns/${id}`);
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
      minHeight: '100vh',
      paddingBottom: '80px' // Espacio para la barra de navegación
    }}>
      <Container maxWidth="md" sx={{ pt: 4, pb: 10 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #9C27B0 30%, #CE93D8 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Patrones Espirituales
        </Typography>
        
        {/* Filtros */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar patrones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                  labelId="categoria-label"
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  label="Categoría"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Todas las categorías</MenuItem>
                  {categorias.map((cat, index) => (
                    <MenuItem key={index} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={showCompleted ? "Ocultar completados" : "Mostrar completados"}
              clickable
              color={showCompleted ? "primary" : "default"}
              onClick={() => setShowCompleted(!showCompleted)}
              icon={<CheckCircleIcon />}
              sx={{ mr: 1 }}
            />
            
            <Typography variant="body2" color="textSecondary">
              {filteredPatrones.length > 0 
                ? `Mostrando ${filteredPatrones.length} de ${patrones.length} patrones`
                : 'No se encontraron patrones con los filtros actuales'}
            </Typography>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Lista de patrones */}
            <Grid container spacing={2}>
              {filteredPatrones.map((patron) => (
                <Grid item xs={12} sm={6} md={4} key={patron._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: patron.personalizado 
                        ? 'linear-gradient(135deg, #4A148C 0%, #2D2D2D 100%)' 
                        : 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      position: 'relative',
                      opacity: patron.completado ? 0.7 : 1
                    }}
                  >
                    {patron.completado && (
                      <CheckCircleIcon 
                        color="primary" 
                        sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          right: 10,
                          zIndex: 1
                        }} 
                      />
                    )}
                    
                    <CardActionArea 
                      onClick={() => handlePatternClick(patron._id)}
                      sx={{ height: '100%', p: 2 }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: patron.personalizado ? '#CE93D8' : 'white'
                          }}
                        >
                          {patron.nombre}
                        </Typography>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Typography 
                          variant="body2" 
                          color="textSecondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 1
                          }}
                        >
                          {patron.descripcion || 'Sin descripción'}
                        </Typography>
                        
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={patron.categoria} 
                            size="small" 
                            color={patron.personalizado ? "secondary" : "primary"}
                            variant="outlined"
                          />
                          
                          {patron.personalizado && (
                            <Chip 
                              label="Personalizado" 
                              size="small" 
                              color="secondary"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
      
      <Navbar />
    </Box>
  );
};

export default PatternList;
