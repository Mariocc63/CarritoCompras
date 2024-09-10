import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useContext(AuthContext);

  // Verificar si el usuario está autenticado
  if (!auth || !auth.user) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" />;
  }

  // Verificar si el rol del usuario coincide con el requerido
  if (requiredRole && auth.user.data[0].rol_idrol !== requiredRole) {
    // Si el usuario no tiene el rol adecuado, redirige a una página de acceso denegado
    return <Navigate to="/access-denied" />;
  }

  // Si todo está bien, renderiza la ruta protegida
  return children;
};

export default ProtectedRoute;
