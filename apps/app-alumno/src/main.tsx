import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/Inicio';
import { Actividad } from './pages/Actividad';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/actividad/:id" element={<Actividad />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
