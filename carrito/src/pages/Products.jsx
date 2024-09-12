import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { Box, Button} from '@mui/material';

const Products = () => {
  const { auth, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();


  return ( <>
    <Box sx={{ p: 2 }}>
    <ProductList token={auth.token} />
    </Box>
  </>
  )
};

export default Products;
