import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const isEmployeeRoute = allowedRoles && allowedRoles.includes('employee');
  const isAdminRoute = allowedRoles && (allowedRoles.includes('admin') || allowedRoles.includes('superadmin'));
  
  let token = null;
  let userStr = null;

  if (isEmployeeRoute) {
    token = localStorage.getItem('employee_token');
    userStr = localStorage.getItem('employee_user');
  } else if (isAdminRoute) {
    token = localStorage.getItem('admin_token');
    userStr = localStorage.getItem('admin_user');
  } else {
    // Fallback if no specific role is required
    token = localStorage.getItem('admin_token') || localStorage.getItem('employee_token');
    userStr = localStorage.getItem('admin_user') || localStorage.getItem('employee_user');
  }
  
  if (!token || !userStr) {
    if (isEmployeeRoute) {
      return <Navigate to="/employee-login" replace />;
    }
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
    if (isEmployeeRoute) {
      localStorage.removeItem('employee_token');
      localStorage.removeItem('employee_user');
      return <Navigate to="/employee-login" replace />;
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return <Navigate to="/login" replace />;
    }
  }
};

export default ProtectedRoute;
