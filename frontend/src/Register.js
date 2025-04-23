import React, { useState, useContext, useEffect } from 'react';
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
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

// Componente de fondo cósmico (reutilizado del componente Login)
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

const Register = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');
  const [securityVerified, setSecurityVerified] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const { register, loading, error, setError, verifySecurityQuestions } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función para verificar las respuestas de seguridad
  const handleVerifySecurityQuestions = () => {
    if (!securityAnswer1 || !securityAnswer2) {
      setSecurityError(t('required_fields'));
      return;
    }

    // Verificar respuestas (implementado en AuthContext)
    const isVerified = verifySecurityQuestions(securityAnswer1, securityAnswer2);
    
    if (isVerified) {
      setSecurityVerified(true);
      setSecurityError('');
      setActiveStep(1);
    } else {
      setSecurityError(t('verification_error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password || !confirmPassword || !nombre) {
      setError(t('required_fields'));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t('passwords_not_match'));
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    const success = await register(email, password, nombre);
    if (success) {
      navigate('/dashboard');
    }
  };

  // Renderizar el paso de verificación de seguridad
  const renderSecurityQuestions = () => {
    return (
      <>
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
          {t('security_question_title')}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="textSecondary" 
          align="center"
          sx={{ mb: 4 }}
        >
          {t('security_question_subtitle')}
        </Typography>
        
        {securityError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {securityError}
          </Alert>
        )}
        
        <TextField
          label={t('question1')}
          type="text"
          fullWidth
          margin="normal"
          variant="outlined"
          value={securityAnswer1}
          onChange={(e) => setSecurityAnswer1(e.target.value)}
          required
          placeholder={t('answer1_placeholder')}
          disabled={loading}
        />
        
        <TextField
          label={t('question2')}
          type="text"
          fullWidth
          margin="normal"
          variant="outlined"
          value={securityAnswer2}
          onChange={(e) => setSecurityAnswer2(e.target.value)}
          required
          placeholder={t('answer2_placeholder')}
          disabled={loading}
          sx={{ mb: 3 }}
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleVerifySecurityQuestions}
          disabled={loading}
          sx={{ 
            py: 1.5,
            mb: 2,
            background: 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('verify_button')}
        </Button>
      </>
    );
  };

  // Renderizar el formulario de registro
  const renderRegistrationForm = () => {
    return (
      <>
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
          {t('register_title')}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="textSecondary" 
          align="center"
          sx={{ mb: 4 }}
        >
          {t('register_subtitle')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('name')}
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
          />
          
          <TextField
            label={t('email')}
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
            label={t('password')}
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          <TextField
            label={t('confirm_password')}
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : t('register_button')}
          </Button>
        </form>
      </>
    );
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
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                <Step>
                  <StepLabel>{t('security_question_title')}</StepLabel>
                </Step>
                <Step>
                  <StepLabel>{t('register_title')}</StepLabel>
                </Step>
              </Stepper>
              
              {activeStep === 0 ? renderSecurityQuestions() : renderRegistrationForm()}
              
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                {t('have_account')} <Link to="/login" style={{ color: '#CE93D8', textDecoration: 'none' }}>{t('login_link')}</Link>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Register;
