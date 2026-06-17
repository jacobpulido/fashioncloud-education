import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Revisar } from './pages/Revisar';
import { Calificar } from './pages/Calificar';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/revisar/:actividadId" element={<Revisar />}/>
      <Route path="/calificar/:materiaId" element={<Calificar />}/>
    </Routes>
  </BrowserRouter>);
//# sourceMappingURL=main.js.map