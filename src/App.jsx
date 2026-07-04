import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login'; // <--- Cambia 'login' por 'Login' (y asegúrate que el archivo se llame Login.jsx)
import DashboardInspector from './DashboardInspector';
import DashboardSupervisor from './DashboardSupervisor';
import DashboardOperador from './DashboardOperador';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/inspector" element={<DashboardInspector />} />
        <Route path="/supervisor" element={<DashboardSupervisor />} />
        <Route path="/operador" element={<DashboardOperador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
//forzando despliegue en netlify