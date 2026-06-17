import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Revisar } from './pages/Revisar';
import { Calificar } from './pages/Calificar';
import { Login } from './pages/Login';
import './styles.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLogged } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/revisar/:actividadId" element={<ProtectedRoute><Revisar /></ProtectedRoute>} />
        <Route path="/calificar/:materiaId" element={<ProtectedRoute><Calificar /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
