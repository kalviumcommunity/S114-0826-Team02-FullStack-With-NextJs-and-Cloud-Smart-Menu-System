import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="spinner">
        <div className="spin"></div>
        <span className="loading-text">&nbsp;Validating credentials...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If owner tries to access customer page or vice versa
    return <Navigate to={user.role === 'owner' ? '/owner/dashboard' : '/menu'} replace />;
  }

  return children;
}
export default ProtectedRoute;
