import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useContext(AuthContext);

  if (!auth || !auth.user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && auth.user.data[0].rol_idrol !== requiredRole) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default ProtectedRoute;
