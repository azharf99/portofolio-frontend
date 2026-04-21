import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPortfolioForm from './pages/AdminPortfolioForm';
import AdminUserEdit from './pages/AdminUserEdit';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route
            path="/admin/portfolios"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/portfolios/new"
            element={
              <ProtectedRoute>
                <AdminPortfolioForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/portfolios/:id/edit"
            element={
              <ProtectedRoute>
                <AdminPortfolioForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <ProtectedRoute>
                <AdminUserEdit />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/portfolios" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}