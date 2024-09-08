import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { Box, Button} from '@mui/material';

const Products = () => {
  const { auth, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // const CerrarSesion = () => {
  //   logoutUser();
  //   navigate("/login")
  // }
  // useEffect(() => {
  //   if (auth.user?.idrol !== 2) {
  //     navigate('/login');  // Redirige si no es cliente
  //   }
  // }, [auth, navigate]);

  return ( <>
    <Box sx={{ p: 2 }}>
    <ProductList token={auth.token} />
    </Box>
    
    {/* <Button variant="contained" 
            color="secondary" 
            onClick={CerrarSesion}
    >
            Cerrar sesión
    </Button> */}
  </>
  )
};

export default Products;
