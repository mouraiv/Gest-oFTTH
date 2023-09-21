import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const refreshToken = sessionStorage.getItem("@App:token");
  let auth = { token: refreshToken};

  return auth.token ? (<Outlet />) : (<Navigate to="/" replace />);  
}

export default ProtectedRoute;
