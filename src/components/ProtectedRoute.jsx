import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Mengecek apakah ada token di localStorage
  const token = localStorage.getItem('token');

  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, izinkan masuk ke komponen anak (Admin Dashboard)
  return children;
}