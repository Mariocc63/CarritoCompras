import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { auth, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  //console.log(auth.user);

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login")
  }

  return (
    <div>
      {auth.user ? (
        <div>
          <Typography variant="h5">Bienvenido, {auth.user.data[0].nombre_completo} con rol {auth.user.data[0].rol_idrol} </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={CerrarSesion}
          >
            Cerrar sesión
          </Button>
        </div>
      ) : (
        <Typography variant="h5">Cargando datos...</Typography>
      )}
    </div>
  );
};

export default Home;