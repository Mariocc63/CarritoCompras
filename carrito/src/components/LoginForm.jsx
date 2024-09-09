import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; 
import * as yup from 'yup'; // Importar Yup para validaciones
import { TextField, Button, Box, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Definir esquema de validación con Yup
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Formato de correo inválido')
    .required('El correo es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida')
});

const LoginForm = () => {
  const {auth, loginUser} = useContext(AuthContext);  // Verifica que estamos accediendo correctamente a loginUser
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // Usar useForm con el esquema de validación de yup
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema), // Resolver de Yup para validaciones
  });

  useEffect(() => {
    if (auth && auth.user && auth.user.data && auth.user.data.length > 0) {
      // Redirigir basándose en el rol después de iniciar sesión
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
    //navigate("/products")
    }
    catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5">Iniciar Sesión</Typography>

      <TextField
        label="Correo electrónico"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email ? errors.email.message : ""}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Contraseña"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ""}
        fullWidth
        margin="normal"
      />

      {loginError && (
        <Typography color="error" variant="body2">
          {loginError}
        </Typography>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Iniciar Sesión
      </Button>

      <Button
        variant="text"
        color="secondary"
        fullWidth
        onClick={() => navigate('/register')}
        style={{ marginTop: '1rem' }}
      >
        ¿No tienes cuenta? Registrarse
      </Button>
    </Box>
  );
};

export default LoginForm;