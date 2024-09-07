import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to="/login" />; // Si no está autenticado, redirigir a login
  }

  // Si es cliente (idrol === 2), redirigir a la página de productos
  if (auth.user.data[0].rol_idrol === 2) {
    console.log(auth.user.data[0].rol_idrol);
    return <Navigate to="/products" />;
  }

  // Si es admin (idrol === 1), mostrar el componente pasado como props (Home)
  if (auth.user.data[0].rol_idrol === 1) {
    console.log(auth.user.data[0].rol_idrol);
    return <Component />;
  }

  // Para cualquier otro rol, redirigir al login (opcional)
  //return <Navigate to="/login" />;
};

export default ProtectedRoute;
