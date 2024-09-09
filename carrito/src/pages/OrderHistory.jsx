import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const { auth, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const idusuarios = auth?.user?.data[0]?.idusuarios;
  const navigate = useNavigate();
  const {clearCart} = useContext(CartContext);
  
  //let idusuarios = null;

  useEffect(() => {
    if(idusuarios) {
        const fetchOrderHistory = async () => {
        try {
            //console.log(auth.user.data[0]);
            const response = await axios.get(`http://localhost:5000/api/historial/detalles/${idusuarios}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setOrderHistory(response.data.historial.ordenes);
        } catch (error) {
            console.error('Error al traer el historial de ordenes', error);
        }
        finally {
            setLoading(false); // Una vez finalizado, cambiar el estado de carga
            }
        };
        fetchOrderHistory();
    }
    else {
        setLoading(false);
    }

  }, [idusuarios]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
    clearCart();
  }

  const handleGoBack = () => {
    navigate('/products');
  }

  if (loading) {
    return <div>Cargando historial de órdenes...</div>;
  }

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Historial de Órdenes
      </Typography>
      <Grid container spacing={2}>
        {orderHistory.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.idorden}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Orden #{order.idorden}
                </Typography>
                <Typography>
                  Fecha de Creación: {moment(order.fecha_creacion).format('YYYY/MM/DD HH:mm:ss')}
                </Typography>
                <Typography>
                  Nombre: {order.nombre_completo}
                </Typography>
                <Typography>
                  Dirección: {order.direccion}
                </Typography>
                <Typography>
                  Fecha de entrega: {order.fecha_entrega}
                </Typography>
                <Typography>
                  Total: Q{order.total_orden}
                </Typography>
                <Typography>
                  Estado: {order.estado}
                </Typography>
                <Typography>
                  Comentaios del pedido: {order.comentarios}
                </Typography>
                <Typography variant="h6">Detalles:</Typography>
                <ul>
                  {order.detalles.map((detalle, index) => (
                    <li key={index}>
                      {detalle.producto} - Cantidad: {detalle.cantidad} - Precio Q{detalle.precio} - Subtotal: Q{detalle.subtotal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
      <Button onClick={handleGoBack} color="secondary" variant="contained">
        Regresar
      </Button>
    </Box>
  );
};

export default OrderHistory;
