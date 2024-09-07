import React from 'react';
import { useCart } from '../context/CartContext';
import { Button, Typography } from '@mui/material';

const Cart = () => {
  const { cartItems, getTotal, clearCart } = useCart();

  return (
    <div>
      <Typography variant="h4">Carrito de Compras</Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6">El carrito está vacío.</Typography>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <Typography variant="h6">{item.producto}</Typography>
              <Typography variant="body2">Cantidad: {item.cantidad}</Typography>
              <Typography variant="body2">Precio: Q{item.precio * item.cantidad}</Typography>
            </div>
          ))}
          <Typography variant="h5">Subtotal: ${getTotal()}</Typography>
          <Button variant="contained" color="primary" onClick={() => alert('Compra confirmada')}>
            Confirmar compra
          </Button>
          <Button variant="outlined" color="secondary" onClick={clearCart}>
            Limpiar carrito
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;