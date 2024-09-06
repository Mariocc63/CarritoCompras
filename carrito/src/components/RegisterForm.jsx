import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Validación con Yup
const schema = yup.object().shape({
  nombre_completo: yup.string().required('El nombre es obligatorio'),
  correo_electronico: yup.string().email('Correo inválido').required('El correo es obligatorio'),
  contrasenia: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  telefono: yup.string().matches(/^[0-9]+$/, 'Debe ser un número válido').required('El teléfono es obligatorio'),
  fecha_nacimiento: yup.date().required('La fecha de nacimiento es obligatoria').nullable(),
});

const RegisterForm = () => {
  const { registerUser } = useContext(AuthContext); 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { setAuth } = useContext(AuthContext);  // Para actualizar el estado de autenticación
  const [registerError, setRegisterError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setRegisterError(null);  // Limpiar error previo

    const fecha = new Date(data.fecha_nacimiento);
    const fechaFormatoCorrecto = fecha.toISOString().split('T')[0];
    const nueva_data = {"nombre_completo": data.nombre_completo, "correo_electronico": data.correo_electronico,
      "contrasenia": data.contrasenia, "telefono": data.telefono, "fecha_nacimiento": fechaFormatoCorrecto}
    
    try {
      
      

      const user = await registerUser(nueva_data);  // Llamar a la función registerUser del contexto
      setAuth(user);
      alert('Usuario registrado con éxito');
      navigate("/login");
      //console.log('Usuario registrado con éxito');
    } catch (error) {
      setRegisterError('Error al registrar el usuario');
      console.error('Error:', error);
      //console.log(nueva_data);
      //console.log(fechaFormatoCorrecto);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5">Registro de Usuario</Typography>
      
      <TextField
        label="Nombre"
        {...register('nombre_completo')}
        error={!!errors.nombre_completo}
        helperText={errors.nombre_completo?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Correo electrónico"
        {...register('correo_electronico')}
        error={!!errors.correo_electronico}
        helperText={errors.correo_electronico?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Contraseña"
        type="password"
        {...register('contrasenia')}
        error={!!errors.contrasenia}
        helperText={errors.contrasenia?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Teléfono"
        {...register('telefono')}
        error={!!errors.telefono}
        helperText={errors.telefono?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Fecha de nacimiento"
        type="date"
        {...register('fecha_nacimiento')}
        error={!!errors.fecha_nacimiento}
        helperText={errors.fecha_nacimiento?.message}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}  // Para que la etiqueta del campo de fecha se mantenga visible
      />

      {registerError && (
        <Typography color="error" variant="body2">
          {registerError}
        </Typography>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Registrarse
      </Button>
      <Button
        variant="text"
        color="secondary"
        fullWidth
        onClick={() => navigate('/login')}
        style={{ marginTop: '1rem' }}
      >
        Regresar
      </Button>
    </Box>
  );
};

export default RegisterForm;
