import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/authContext';

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user, loader } = useContext(AuthContext);

  if (loader) return <div>Cargando...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/IniciarSesion" replace />;
  }

  if (roles && !roles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
