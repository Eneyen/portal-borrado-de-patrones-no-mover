import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <SadIcon sx={{ fontSize: 80, color: '#9C27B0', mb: 2 }} />
          
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #9C27B0 30%, #CE93D8 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Página no encontrada
          </Typography>
          
          <Typography variant="body1" paragraph color="textSecondary">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ 
              mt: 2,
              background: 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)',
            }}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;
