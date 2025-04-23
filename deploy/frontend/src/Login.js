import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

// Componente de fondo cósmico
const CosmicBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(135deg, #121212 0%, #4A148C 100%)',
        overflow: 'hidden'
      }}
      id="cosmic-bg"
    >
      {Array.from({ length: 100 }).map((_, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            position: 'absolute',
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            opacity: Math.random() * 0.8,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `twinkle ${Math.random() * 4 + 3}s infinite`
          }}
        />
      ))}
    </Box>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <CosmicBackground />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Card 
            sx={{ 
              width: '100%',
              maxWidth: 450,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #9C27B0 30%, #CE93D8 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Portal de Patrones Espirituales
              </Typography>
              
              <Typography 
                variant="body1" 
                color="textSecondary" 
                align="center"
                sx={{ mb: 4 }}
              >
                Accede para gestionar tus patrones de ascensión espiritual
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Correo Electrónico"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                
                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ mb: 3 }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5,
                    mb: 2,
                    background: 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                </Button>
              </form>
              
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                ¿No tienes una cuenta? <Link to="/register" style={{ color: '#CE93D8', textDecoration: 'none' }}>Regístrate</Link>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Login;
