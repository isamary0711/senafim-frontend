import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import login from './login';
import DashboardInspector from './DashboardInspector';
import DashboardSupervisor from './DashboardSupervisor';
import DashboardOperador from './DashboardOperador'; // <-- IMPORTA AQUÍ

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inspector" element={<DashboardInspector />} />
        <Route path="/supervisor" element={<DashboardSupervisor />} />
        {/* NUEVA RUTA PARA EL OPERADOR */}
        <Route path="/operador" element={<DashboardOperador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;