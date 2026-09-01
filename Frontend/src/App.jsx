import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import OwnerOrdersPage from './pages/OwnerOrdersPage';
import AuditLogPage from './pages/AuditLogPage';

function HomeRedirect() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="spinner">
        <div className="spin"></div>
        <span className="loading-text">&nbsp;Initializing system...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === 'owner' ? '/owner/dashboard' : '/menu'} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/menu"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/orders"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/audit"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <AuditLogPage />
              </ProtectedRoute>
            }
          />

          {/* Root Redirect & Fallbacks */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
