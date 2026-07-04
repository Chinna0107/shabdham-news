import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
  const userStr = localStorage.getItem('adminUser') || localStorage.getItem('admin_user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // If specific roles are required, check if user has one of them
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to a default page or show unauthorized
        // If they are an employee trying to access admin, send to employee dash
        if (user.role === 'employee') {
          return <Navigate to="/employee/dashboard" replace />;
        } else {
          return <Navigate to="/admin/dashboard" replace />;
        }
      }
    }
    
    return <Outlet />;
  } catch (err) {
    // If json parse fails
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('admin_user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
