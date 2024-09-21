import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; 
import * as yup from 'yup'; 
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Formato de correo inválido')
    .required('El correo es requerido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
});

const LoginForm = () => {
  const {auth, loginUser} = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema), 
  });

  useEffect(() => {
    if (auth && auth.user && auth.user.data && auth.user.data.length > 0) {
      if (auth.user.data[0].rol_idrol === 2) {
        navigate('/products');
      } else if (auth.user.data[0].rol_idrol === 1) {
        navigate('/confirmed-orders');
      }
    }
  }, [auth, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoginError("");
      await loginUser(data.email, data.password);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Container maxWidth="xs">
        
        {/* Título centrado arriba, fuera del Paper */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">
            Iniciar Sesión
          </Typography>
        </Box>

        {/* Paper para el formulario */}
        <Paper elevation={6} sx={{ padding: '30px', borderRadius: '15px'}}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Correo electrónico"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              margin="normal"
              variant="outlined"
            />

            {loginError && (
              <Typography color="error" variant="body2" align="center">
                {loginError}
              </Typography>
            )}

            <Box textAlign="center" mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Iniciar Sesión
              </Button>
            </Box>

            <Box textAlign="center" mt={2}>
              <Button
                variant="text"
                color="secondary"
                onClick={() => navigate('/register')}
                fullWidth
              >
                ¿No tienes cuenta? Registrate
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;
