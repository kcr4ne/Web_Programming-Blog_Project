import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // While checking for user authentication, show a loading message.
    return <div>인증 상태를 확인하는 중...</div>;
  }

  // If the user is authenticated, render the nested content (the actual page).
  // Otherwise, redirect them to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
