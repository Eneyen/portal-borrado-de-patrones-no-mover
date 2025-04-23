import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

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

const Instructions = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/dashboard')}
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
            Instrucciones para el Borrado de Patrones
          </Typography>
        </Box>
        
        {/* Contenido principal */}
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
          <Typography variant="h6" gutterBottom>
            Técnica para Borrar Patrones
          </Typography>
          
          <Typography variant="body1" paragraph>
            El borrado de patrones es una técnica poderosa para liberar bloqueos energéticos y avanzar en tu proceso de ascensión espiritual. A continuación, se presenta la técnica recomendada para trabajar con los patrones listados en este portal.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#CE93D8' }}>
            Pasos para el Borrado de Patrones:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Paso 1: Identificación" 
                secondary="Selecciona un patrón que resuene contigo en este momento. Puedes buscar por categorías o utilizar la función de búsqueda." 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Paso 2: Reconocimiento" 
                secondary="Reconoce cómo este patrón se manifiesta en tu vida. Observa sin juzgar." 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Paso 3: Respiración Consciente" 
                secondary="Realiza tres respiraciones profundas, inhalando luz y exhalando cualquier resistencia." 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Paso 4: Decreto de Liberación" 
                secondary="Pronuncia en voz alta: 'Yo [tu nombre], en nombre de mi Ser Superior, decreto que borro, disuelvo y libero permanentemente este patrón de [nombre del patrón] de todos mis cuerpos, de todas mis vidas pasadas, presentes y futuras, de todas mis líneas de tiempo y dimensiones.'" 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Paso 5: Visualización" 
                secondary="Visualiza una luz violeta transmutadora que disuelve completamente este patrón en todas tus células y campos energéticos." 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Paso 6: Gratitud" 
                secondary="Agradece a tu Ser Superior y a los Maestros Ascendidos por su asistencia en este proceso." 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Paso 7: Registro" 
                secondary="Marca el patrón como completado en el portal para llevar un registro de tu progreso." 
              />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#CE93D8' }}>
            Recomendaciones:
          </Typography>
          
          <Typography variant="body2" paragraph>
            • Trabaja con un máximo de 3-5 patrones por día para permitir una integración adecuada.
          </Typography>
          
          <Typography variant="body2" paragraph>
            • Mantén un estado de hidratación óptimo durante el proceso de borrado.
          </Typography>
          
          <Typography variant="body2" paragraph>
            • Es normal experimentar liberaciones emocionales o físicas después del borrado de patrones.
          </Typography>
          
          <Typography variant="body2" paragraph>
            • Puedes añadir tus propios patrones personalizados a medida que los identifiques en tu proceso.
          </Typography>
          
          <Typography variant="body2">
            • Confía en tu intuición y en la guía de tu Ser Superior durante todo el proceso.
          </Typography>
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <InfoIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Typography variant="h6">
              Sobre la 6ª y 7ª Iniciación
            </Typography>
          </Box>
          
          <Typography variant="body2" paragraph>
            El período entre la sexta y la séptima iniciación es un tiempo sagrado de integración y elevación. Durante este período, tu Ser Superior desciende gradualmente a tu cuerpo físico a través del Sagrado Corazón.
          </Typography>
          
          <Typography variant="body2" paragraph>
            El borrado de patrones es una herramienta esencial para facilitar este proceso, permitiendo que tu frecuencia vibracional se eleve y creando el espacio necesario para que tu Ser Superior habite plenamente en tu vehículo físico.
          </Typography>
          
          <Typography variant="body2">
            Recuerda que cada persona avanza a su propio ritmo. No hay prisa ni presión. Tu ascensión se mide ahora por el porcentaje de Ser Superior en tu cuerpo, y llegarás a la 7ª iniciación cuando este porcentaje alcance el 100%.
          </Typography>
        </Paper>
      </Container>
      
      <Navbar />
    </Box>
  );
};

export default Instructions;
