import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Panel } from './pages/Panel';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter>
    <Routes>
      <Route path="/" element={<Panel />}/>
    </Routes>
  </BrowserRouter>);
//# sourceMappingURL=main.js.map