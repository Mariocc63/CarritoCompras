import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
    IconButton, Menu, MenuItem } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ORDER_STATES = {
    ENTREGADO: 8,
    RECHAZADO: 9
  };

const OrderDetails = () => {
  const { idorden } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const { auth, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/verordenes', {
            headers: { Authorization: `Bearer ${auth.token}` }
          });
        const orders = response.data.historial.ordenes;
        const selectedOrder = orders.find(order => order.idorden === parseInt(idorden, 10));
        setOrder(selectedOrder);
      } catch (error) {
        console.error('Error al obtener los datos de la orden:', error);
      }
    };

    fetchOrderDetails();
  }, [idorden]);

  const handleConfirm = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orden/detalles/${idorden}`, {
        estados_idestados: ORDER_STATES.ENTREGADO
      },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    );
      alert("Orden entregada correctamente");
      navigate('/confirmed-orders');
    } catch (error) {
      console.error('Error al confirmar la orden:', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orden/detalles/${idorden}`, {
        estados_idestados: ORDER_STATES.RECHAZADO,
        comentarios: rejectComment
      },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    );
      alert("Orden rechazada correctamente");
      navigate('/confirmed-orders');
    } catch (error) {
      console.error('Error al rechazar la orden:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/confirmed-orders');
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
  }

  return (
    <Box padding={2}>
      {order ? (
        <>
          <Typography variant="h4">Detalles de la Orden</Typography>
          <Typography>Orden #: {order.idorden}</Typography>
          <Typography>Nombre: {order.nombre}</Typography>
          <Typography>Dirección: {order.direccion}</Typography>
          <Typography>Teléfono: {order.telefono}</Typography>
          <Typography>Correo Electrónico: {order.correo_electronico}</Typography>
          <Typography>Fecha de Entrega: {order.fecha_entrega}</Typography>
          <Typography>Total: Q{order.total_orden}</Typography>
          <Typography variant="h6">Detalles:</Typography>
          <ul>
            {order.detalles.map(detail => (
              <li key={detail.producto}>
                {detail.producto} - Cantidad: {detail.cantidad} - Precio: Q{detail.precio} - Subtotal: Q{detail.subtotal}
              </li>
            ))}
          </ul>
          <Button variant="contained" color="primary" onClick={() => setOpenConfirmDialog(true)}>
            Entregar
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpenRejectDialog(true)}>
            Rechazar
          </Button>

          <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
            <DialogTitle>Entregar Orden</DialogTitle>
            <DialogContent>
              <Typography>¿Estás seguro de que quieres entregar esta orden?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleConfirm} color="primary">
                Entregar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
            <DialogTitle>Rechazar Orden</DialogTitle>
            <DialogContent>
              <Typography>¿Estás seguro de que quieres rechazar esta orden?</Typography>
              <TextField
                label="Comentario"
                multiline
                rows={4}
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRejectDialog(false)} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleReject} color="primary">
                Rechazar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography>Cargando detalles de la orden...</Typography>
      )}
      <Button onClick={handleGoBack} color="default">
        Regresar
      </Button>
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
    </Box>
  );
};

export default OrderDetails;
