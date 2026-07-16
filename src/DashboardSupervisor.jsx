import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, LogOut, Clock, Menu, X, TrendingUp, Truck, Database, Search, Download, Calendar, Scale } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function DashboardSupervisor() {
  const navigate = useNavigate();
  
  const [vistaActiva, setVistaActiva] = useState('panel'); 
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fechaActual, setFechaActual] = useState(new Date());

  const [historialGlobal, setHistorialGlobal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTiempo, setFiltroTiempo] = useState('diario'); 

  const [metricas, setMetricas] = useState({
    totalViajes: 0,
    totalToneladas: 0,
    promedioCarga: 0
  });

  useEffect(() => {
    const timer = setInterval(() => setFechaActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    cargarDatosGlobales();
  }, []);

  useEffect(() => {
    const datosFiltrados = filtrarDatosPorTiempo(historialGlobal, filtroTiempo);
    calcularKPIs(datosFiltrados);
  }, [historialGlobal, filtroTiempo]);

  const cargarDatosGlobales = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const respuesta = await fetch('https://senafim-api.onrender.com/api/pesajes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const datos = await respuesta.json();
      if (respuesta.ok) setHistorialGlobal(datos);
    } catch (error) {
      console.error('Error cargando auditoría:', error);
    } finally {
      setCargando(false);
    }
  };

  const filtrarDatosPorTiempo = (datos, filtro) => {
    const hoy = new Date();
    const hoyISO = hoy.toISOString().split('T')[0]; 
    const mesActual = hoyISO.substring(0, 7); 
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    const hace7DiasISO = hace7Dias.toISOString().split('T')[0];

    return datos.filter(item => {
      if (!item.fecha_registro) return false;
      const fechaRegistro = item.fecha_registro.split('T')[0]; 
      switch (filtro) {
        case 'diario': return fechaRegistro === hoyISO;
        case 'semanal': return fechaRegistro >= hace7DiasISO && fechaRegistro <= hoyISO;
        case 'mensual': return fechaRegistro.startsWith(mesActual);
        default: return true;
      }
    });
  };

  const exportarExcel = () => {
    const datosParaExportar = filtrarDatosPorTiempo(historialGlobal, filtroTiempo);
    if (datosParaExportar.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const datosFormateados = datosParaExportar.map(item => ({
      "TICKET": item.consecutivo_ticket,
      "FECHA": item.fecha_registro?.split('T')[0],
      "HORA": item.hora_registro?.substring(0, 5),
      "PLACA": item.placa,
      "MINA": item.mina,
      "COMPRADOR": item.comprador,
      "PESO NETO (KG)": parseFloat(item.peso_neto_kg || 0)
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosFormateados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, `Reporte_SENAFIM_${filtroTiempo}.xlsx`);
  };

  const calcularKPIs = (datos) => {
    const totalViajes = datos.length;
    const totalKg = datos.reduce((acc, curr) => acc + parseFloat(curr.peso_neto_kg || 0), 0);
    const totalToneladas = totalKg / 1000;
    const promedio = totalViajes > 0 ? (totalToneladas / totalViajes) : 0;
    setMetricas({ totalViajes, totalToneladas: totalToneladas.toFixed(2), promedioCarga: promedio.toFixed(2) });
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const datosBusqueda = historialGlobal.filter(item => 
    item.placa?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.numero_guia?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.consecutivo_ticket?.toString().includes(busqueda)
  );

  return (
    <div className="min-h-screen bg-[#050B14] font-sans text-slate-300 flex overflow-hidden">
      {menuAbierto && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" onClick={() => setMenuAbierto(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A162C]/95 backdrop-blur-xl border-r border-indigo-900/30 flex flex-col shadow-2xl transition-transform lg:translate-x-0 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-indigo-900/30 flex justify-between items-center">
          <img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-8" />
          <button className="lg:hidden text-slate-400" onClick={() => setMenuAbierto(false)}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 flex-1 space-y-2">
          <button onClick={() => setVistaActiva('panel')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${vistaActiva === 'panel' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            <LayoutDashboard className="w-5 h-5" /> <span>Métricas (KPIs)</span>
          </button>
          <button onClick={() => setVistaActiva('auditoria')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${vistaActiva === 'auditoria' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            <ShieldCheck className="w-5 h-5" /> <span>Auditoría</span>
          </button>
        </div>
        <div className="p-4"><button onClick={handleCerrarSesion} className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-400 py-2.5 rounded-lg border border-red-500/20"><LogOut className="w-4 h-4" /> <span>Salir</span></button></div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-[#050B14]/80 border-b border-indigo-900/30 flex justify-between items-center px-8">
          <h1 className="text-xl font-bold text-white uppercase">Módulo Supervisor</h1>
          <div className="flex items-center space-x-2 bg-indigo-900/20 border border-indigo-500/20 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-indigo-100">{fechaActual.toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {vistaActiva === 'panel' ? (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Resumen Operativo</h2>
                <div className="flex gap-3">
                  <select value={filtroTiempo} onChange={(e) => setFiltroTiempo(e.target.value)} className="bg-[#0A162C] border border-indigo-500/30 text-white rounded-lg px-3 py-2 cursor-pointer">
                    <option value="diario">Hoy</option>
                    <option value="semanal">Últimos 7 Días</option>
                    <option value="mensual">Mes Actual</option>
                    <option value="historico">Histórico</option>
                  </select>
                  <button onClick={exportarExcel} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Download size={18} /> Exportar</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl"><h3 className="text-slate-400">Total Toneladas</h3><p className="text-5xl font-black text-white">{metricas.totalToneladas}</p></div>
                <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl"><h3 className="text-slate-400">Total Viajes</h3><p className="text-5xl font-black text-white">{metricas.totalViajes}</p></div>
                <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl"><h3 className="text-slate-400">Promedio/Carga</h3><p className="text-5xl font-black text-white">{metricas.promedioCarga}</p></div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0A162C]/80 border border-white/10 rounded-2xl p-8 shadow-2xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Centro de Auditoría</h2>
                <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="bg-[#050B14] border border-white/10 text-white rounded-lg px-4 py-2" />
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                  <thead><tr className="text-indigo-300 border-b border-indigo-900/30 uppercase text-xs">
                    <th className="p-4">Ticket</th><th className="p-4">Fecha</th><th className="p-4">Placa</th><th className="p-4 text-right">Neto (Kg)</th>
                  </tr></thead>
                  <tbody>{datosBusqueda.map((item) => (
                    <tr key={item.id_registro} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-bold text-indigo-400">#{item.consecutivo_ticket}</td>
                      <td className="p-4 text-slate-400">{item.fecha_registro?.substring(0, 10)}</td>
                      <td className="p-4 font-bold text-white">{item.placa}</td>
                      <td className="p-4 text-right text-emerald-400">{parseFloat(item.peso_neto_kg).toLocaleString()}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}