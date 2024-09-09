// src/pages/ConfirmedOrders.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, IconButton, Menu, MenuItem } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ConfirmedOrders = () => {
  const [orders, setOrders] = useState([]);
  const { auth, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/verordenes', {
            headers: { Authorization: `Bearer ${auth.token}` }
          });
        setOrders(response.data.historial.ordenes);
      } catch (error) {
        console.error('Error al obtener los datos de las ordenes:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Órdenes Confirmadas
      </Typography>
      {orders.map(order => (
        <Card key={order.idorden} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Orden #{order.idorden}</Typography>
            <Typography>Nombre: {order.nombre}</Typography>
            <Typography>Fecha de Creación: {new Date(order.fecha_creacion).toLocaleDateString()}</Typography>
            <Typography>Total: Q{order.total_orden}</Typography>
            <Link
              to={{
                pathname: `/order-details/${order.idorden}`,
                state: { order } // Pasa la orden completa como estado
              }}
            >
              <Button variant="contained" color="primary">
                Ver Detalles
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
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
        <MenuItem > Categoría Productos </MenuItem>
        <MenuItem >Productos</MenuItem>
        <MenuItem onClick={CerrarSesion}>Cerrar Sesión</MenuItem>
      </Menu>
      {/* <Button variant="contained" 
            color="secondary" 
            onClick={CerrarSesion}
      >
            Cerrar sesión
    </Button> */}
    </Box>
  );
};

export default ConfirmedOrders;
