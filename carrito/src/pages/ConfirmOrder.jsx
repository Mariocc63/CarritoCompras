import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AuthContext } from '../context/AuthContext';


// Definir el esquema de validación
const validationSchema = yup.object().shape({
  nombre_completo: yup.string().required('Nombre completo es requerido'),
  direccion: yup.string().required('Dirección es requerida'),
  telefono: yup.string()
    .required('Teléfono es requerido')
    .matches(/^\d+$/, 'Teléfono solo debe contener números'),
  correo_electronico: yup.string()
    .email('Correo electrónico inválido')
    .required('Correo electrónico es requerido'),
  fecha_entrega: yup.date().required('Fecha de entrega es requerida').min(new Date(), 'La fecha de entrega debe ser hoy o una fecha futura'),
});

const ConfirmOrder = () => {
  const { cart, subtotal, clearCart } = useContext(CartContext);
  const [openDialog, setOpenDialog] = useState(false);
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    nombre_completo: '',
    direccion: '',
    telefono: '',
    correo_electronico: '',
    fecha_entrega: '',
  });


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleOpenDialog = (data) => {
    const formattedDate = formatDate(data.fecha_entrega);
    setShippingData({
      ...data,
      fecha_entrega: formattedDate,
    });
    setOpenDialog(true);
  };

  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmit = async (data) => {
    const fecha = new Date(data.fecha_entrega);
    const fechaFormatoCorrecto = fecha.toISOString().split('T')[0];
    try {
      // Preparar los datos para el formato maestro-detalle
      console.log(cart);
      const orderData = { 
          nombre_completo: data.nombre_completo,
          direccion: data.direccion,
          telefono: data.telefono,
          correo_electronico: data.correo_electronico,
          fecha_entrega: fechaFormatoCorrecto,
          detalles_orden: cart.map(item => ({
            productos_idproductos: item.producto.id,
            cantidad: item.cantidad,
        })),
      };

      // Enviar los datos al backend
      await axios.post('http://localhost:5000/api/orden/detalles', orderData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert("Compra confirmada")
      navigate('/products');
      clearCart();
    } catch (error) {
      console.error('Error al confirmar la compra:', error);
    }
  };

  const handleGoBackToCart = () => {
    navigate('/products');
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Confirmar Compra
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Datos de Envío
      </Typography>
      <Box component="form" onSubmit={handleSubmit(handleOpenDialog)} noValidate>
        <TextField
          {...register('nombre_completo')}
          label="Nombre Completo"
          fullWidth
          margin="normal"
          error={!!errors.nombre_completo}
          helperText={errors.nombre_completo?.message}
        />
        <TextField
          {...register('direccion')}
          label="Dirección"
          fullWidth
          margin="normal"
          error={!!errors.direccion}
          helperText={errors.direccion?.message}
        />
        <TextField
          {...register('telefono')}
          label="Teléfono"
          fullWidth
          margin="normal"
          error={!!errors.telefono}
          helperText={errors.telefono?.message}
        />
        <TextField
          {...register('correo_electronico')}
          label="Correo Electrónico"
          fullWidth
          margin="normal"
          error={!!errors.correo_electronico}
          helperText={errors.correo_electronico?.message}
        />
        <TextField
          {...register('fecha_entrega')}
          label="Fecha de Entrega"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: new Date().toISOString().split("T")[0]
          }}
          error={!!errors.fecha_entrega}
          helperText={errors.fecha_entrega?.message}
        />

        <Typography variant="h6" gutterBottom>
          Resumen del pedido
        </Typography>
        <ul>
          {cart.map(item => (
            <li key={item.producto.codigo}>
              {item.producto.producto} - Cantidad: {item.cantidad} - Precio: Q{item.producto.precio}
            </li>
          ))}
        </ul>
        <Typography variant="h6" gutterBottom>
          Total: Q{subtotal}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Confirmar Compra
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={handleGoBackToCart}
        >
          Regresar
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Confirmar Compra</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Estás a punto de confirmar la compra con los siguientes datos:
          <br />Nombre Completo: {shippingData.nombre_completo}
          <br />Dirección: {shippingData.direccion}
          <br />Teléfono: {shippingData.telefono}
          <br />Correo Electrónico: {shippingData.correo_electronico}
          <br />Fecha de Entrega: {shippingData.fecha_entrega}
          <br />¿Estás seguro de continuar?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default ConfirmOrder;
