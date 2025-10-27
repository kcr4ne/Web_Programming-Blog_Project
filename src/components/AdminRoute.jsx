import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>권한을 확인하는 중...</div>;
  }

  // Check if user is logged in and has the 'admin' role
  if (user && profile?.role === 'admin') {
    return <Outlet />;
  }

  // If not an admin, redirect to the home page or a 'not authorized' page
  return <Navigate to="/" replace />;
};

export default AdminRoute;