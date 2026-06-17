import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Inicio } from './pages/Inicio';
import { Actividad } from './pages/Actividad';
import { Login } from './pages/Login';
import './styles.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLogged } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
          <Route path="/actividad/:id" element={<ProtectedRoute><Actividad /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
