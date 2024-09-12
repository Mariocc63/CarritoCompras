import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const newSubtotal = cart.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0
    );
    setSubtotal(newSubtotal);
  }, [cart]);

  const addToCart = (producto) => {
    const existingProduct = cart.find(item => item.producto.codigo === producto.codigo);

    if (existingProduct) {
      const updatedCart = cart.map(item =>
        item.producto.codigo === producto.codigo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { producto, cantidad: 1 }]);
    }
  };

  const decreaseQuantity = (codigo) => {
    const existingProduct = cart.find(item => item.producto.codigo === codigo);

    if (existingProduct && existingProduct.cantidad > 1) {
      const updatedCart = cart.map(item =>
        item.producto.codigo === codigo
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      removeFromCart(codigo);
    }
  };

  const removeFromCart = (codigo) => {
    const updatedCart = cart.filter(item => item.producto.codigo !== codigo);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, subtotal, addToCart, decreaseQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
