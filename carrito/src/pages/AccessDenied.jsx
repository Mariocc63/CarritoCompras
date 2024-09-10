import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh"
    >
      <Typography variant="h4" color="error" gutterBottom>
        Acceso Denegado
      </Typography>
      <Typography variant="body1" gutterBottom>
        No tienes permiso para acceder a esta página.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/login')} 
        sx={{ mt: 2 }}
      >
        Volver al Inicio de Sesión
      </Button>
    </Box>
  );
};

export default AccessDenied;