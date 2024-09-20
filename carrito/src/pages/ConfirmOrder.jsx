import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { TextField, Button, Box, Typography, Grid, Divider, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, IconButton, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const validationSchema = yup.object().shape({
  nombre_completo: yup.string().required('Nombre completo es requerido'),
  direccion: yup.string().required('Dirección es requerida'),
  telefono: yup.string()
    .length(8, "El telefono debe tener 8 caracteres")
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
  const { auth, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
    clearCart();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = async (data) => {
    const fecha = new Date(data.fecha_entrega);
    const fechaFormatoCorrecto = fecha.toISOString().split('T')[0];
    try {
      const orderData = { 
        nombre_completo: data.nombre_completo,
        direccion: data.direccion,
        telefono: data.telefono,
        correo_electronico: data.correo_electronico,
        fecha_entrega: fechaFormatoCorrecto,
        detalles_orden: cart.map(item => ({
          productos_idproductos: item.producto.idproductos,
          cantidad: item.cantidad,
        })),
      };

      await axios.post('http://localhost:5000/api/orden/detalles', orderData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert("Compra confirmada");
      navigate('/products');
      clearCart();
    } catch (error) {
      alert("Error al registrar la compra");
      console.error('Error al confirmar la compra:', error);
    }
  };

  const handleGoBackToCart = () => {
    navigate('/cart');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Confirmar Compra
      </Typography>

    <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: 600 }}>
      <Box component="form" onSubmit={handleSubmit(handleOpenDialog)} noValidate>
        <Typography variant="h6" gutterBottom>
          Datos de Envío
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('nombre_completo')}
              label="Nombre Completo"
              fullWidth
              margin="normal"
              error={!!errors.nombre_completo}
              helperText={errors.nombre_completo?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('direccion')}
              label="Dirección"
              fullWidth
              margin="normal"
              error={!!errors.direccion}
              helperText={errors.direccion?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('telefono')}
              label="Teléfono"
              fullWidth
              margin="normal"
              error={!!errors.telefono}
              helperText={errors.telefono?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('correo_electronico')}
              label="Correo Electrónico"
              fullWidth
              margin="normal"
              error={!!errors.correo_electronico}
              helperText={errors.correo_electronico?.message}
            />
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Resumen del Pedido
        </Typography>
        <Box mb={2}>
          <ul>
            {cart.map(item => (
              <li key={item.producto.codigo}>
                {item.producto.producto} - Cantidad: {item.cantidad} - Precio: Q{item.producto.precio.toFixed(2)} - Subtotal: Q{(item.cantidad * item.producto.precio).toFixed(2)}
              </li>
            ))}
          </ul>
          <Typography variant="h6">
            Total: Q{subtotal.toFixed(2)}
          </Typography>
        </Box>

        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Confirmar Compra
          </Button>
      <Box position="absolute" top={10} left={10}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleGoBackToCart}
          startIcon={<ArrowBackIcon />}
        >
        </Button>
      </Box>
        </Box>
      </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Compra</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de confirmar la compra con los siguientes datos:
            <br />Nombre Completo: {shippingData.nombre_completo}
            <br />Dirección: {shippingData.direccion}
            <br />Teléfono: {shippingData.telefono}
            <br />Correo Electrónico: {shippingData.correo_electronico}
            <br />Fecha de Entrega: {moment(shippingData.fecha_entrega).format('DD/MM/YYYY')}
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

      <IconButton 
        aria-controls="simple-menu" 
        aria-haspopup="true" 
        onClick={handleMenuOpen}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={CerrarSesion}>Cerrar Sesión</MenuItem>
      </Menu>
    </Container>
  );
};

export default ConfirmOrder;
