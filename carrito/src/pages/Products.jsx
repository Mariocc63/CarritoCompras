import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';

const Products = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user?.idrol !== 2) {
      navigate('/login');  // Redirige si no es cliente
    }
  }, [auth, navigate]);

  return auth.user && auth.user.idrol === 2 ? (
    <ProductList token={auth.token} />
  ) : null;
};

export default Products;
