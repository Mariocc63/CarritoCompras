import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Box, Typography, Button, IconButton, Grid, Menu, MenuItem, Card, CardContent, CardActions, Divider, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, subtotal, addToCart, decreaseQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const {auth, logoutUser} = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleConfirmPurchase = () => {
    navigate("/order");
  };

  const isCartEmpty = cart.length === 0;

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
  };

  const handleGoBack = () => {
    navigate('/products');
  };

  return (
    <Box p={3} sx={{ maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h1" align="center">
        Carrito de Compras
      </Typography>
      {isCartEmpty ? (
        <Paper elevation={2} sx={{ padding: 2, textAlign: 'center' }}>
          <Typography variant="body1">El carrito está vacío.</Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2} justifyContent="center">
            {cart.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                  <Box display="flex" alignItems="center">
                    {/* <Avatar src={item.producto.imagen} sx={{ width: 56, height: 56, mr: 2 }} /> */}
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.producto.producto}</Typography>
                  </Box>
                  <Typography variant="body1">
                    Q{item.producto.precio.toFixed(2)} x {item.cantidad} = Q{(item.producto.precio * item.cantidad).toFixed(2)}
                  </Typography>
                  <CardActions>
                    <IconButton color="primary" onClick={() => addToCart(item.producto)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => decreaseQuantity(item.producto.codigo)} disabled={item.cantidad === 1}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => removeFromCart(item.producto.codigo)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" align="right" sx={{ fontWeight: 'bold' }}>
            Total: Q{subtotal.toFixed(2)}
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPurchase}
              >
                Confirmar Compra
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={clearCart}
              >
                Cancelar Compra
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      <IconButton 
        aria-controls="simple-menu" 
        aria-haspopup="true" 
        onClick={handleMenuOpen}
        style={{ position: 'absolute', top: 16, right: 16 }}
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

      <Box position="absolute" top={10} left={10}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleGoBack}
          startIcon={<ArrowBackIcon />}
        >
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
