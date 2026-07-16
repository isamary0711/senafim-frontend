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
    // Nombre del archivo adaptado
    XLSX.writeFile(workbook, `Reporte_BetaArena_${filtroTiempo}.xlsx`);
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
      
      {/* OVERLAY PARA MÓVILES */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" 
          onClick={() => setMenuAbierto(false)} 
        />
      )}
      
      {/* SIDEBAR: fixed en móvil, relative en PC para no solapar el contenido */}
      <aside className={`fixed lg:relative z-40 w-64 h-screen flex-shrink-0 bg-[#0A162C]/95 backdrop-blur-xl border-r border-indigo-900/30 flex flex-col shadow-2xl transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-indigo-900/30 flex justify-between items-center">
          {/* Logo actualizado al proyecto */}
          <img src="/assets/senafim-logo-blanco.png" alt="Beta Arena" className="h-8 object-contain" />
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMenuAbierto(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 space-y-2">
          <button onClick={() => {setVistaActiva('panel'); setMenuAbierto(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${vistaActiva === 'panel' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> <span>Métricas (KPIs)</span>
          </button>
          <button onClick={() => {setVistaActiva('auditoria'); setMenuAbierto(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${vistaActiva === 'auditoria' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <ShieldCheck className="w-5 h-5" /> <span>Auditoría</span>
          </button>
        </div>
        
        <div className="p-4 border-t border-indigo-900/30">
          <button onClick={handleCerrarSesion} className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-lg border border-red-500/20 transition-colors">
            <LogOut className="w-4 h-4" /> <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL: flex-1 y min-w-0 para evitar desbordes en móvil */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        <header className="h-16 flex-shrink-0 bg-[#050B14]/80 border-b border-indigo-900/30 flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-white bg-white/5 p-1.5 rounded-lg" onClick={() => setMenuAbierto(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm md:text-xl font-bold text-white uppercase truncate">Módulo Supervisor</h1>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-900/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-xs md:text-sm text-indigo-100">{fechaActual.toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          {vistaActiva === 'panel' ? (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Resumen Operativo</h2>
                <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
                  <select value={filtroTiempo} onChange={(e) => setFiltroTiempo(e.target.value)} className="flex-1 sm:flex-none bg-[#0A162C] border border-indigo-500/30 text-white text-sm rounded-lg px-3 py-2 cursor-pointer outline-none">
                    <option value="diario">Hoy</option>
                    <option value="semanal">Últimos 7 Días</option>
                    <option value="mensual">Mes Actual</option>
                    <option value="historico">Histórico</option>
                  </select>
                  <button onClick={exportarExcel} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Download size={16} /> <span className="hidden sm:inline">Exportar</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 md:p-6 rounded-2xl">
                  <h3 className="text-slate-400 text-xs md:text-sm uppercase font-bold mb-2">Total Toneladas</h3>
                  <p className="text-3xl md:text-5xl font-black text-white">{metricas.totalToneladas}</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 p-5 md:p-6 rounded-2xl">
                  <h3 className="text-slate-400 text-xs md:text-sm uppercase font-bold mb-2">Total Viajes</h3>
                  <p className="text-3xl md:text-5xl font-black text-white">{metricas.totalViajes}</p>
                </div>
                <div className="bg-emerald-900/20 border border-emerald-500/30 p-5 md:p-6 rounded-2xl sm:col-span-2 lg:col-span-1">
                  <h3 className="text-slate-400 text-xs md:text-sm uppercase font-bold mb-2">Promedio/Carga</h3>
                  <p className="text-3xl md:text-5xl font-black text-white">{metricas.promedioCarga}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0A162C]/80 border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl h-full flex flex-col animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">Centro de Auditoría</h2>
                <div className="w-full md:w-auto relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar ticket o placa..." 
                    value={busqueda} 
                    onChange={(e) => setBusqueda(e.target.value)} 
                    className="w-full md:w-64 bg-[#050B14] border border-white/10 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-colors" 
                  />
                </div>
              </div>
              
              {/* TABLA CON SCROLL HORIZONTAL (Responsive) */}
              <div className="overflow-x-auto flex-1 custom-scrollbar bg-[#050B14] rounded-xl border border-white/5">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-[#0A162C] sticky top-0">
                    <tr className="text-indigo-300 border-b border-indigo-900/30 uppercase text-[10px] md:text-xs tracking-wider">
                      <th className="p-4 font-semibold">Ticket</th>
                      <th className="p-4 font-semibold">Fecha</th>
                      <th className="p-4 font-semibold">Placa</th>
                      <th className="p-4 font-semibold text-right">Neto (Kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {datosBusqueda.length > 0 ? (
                      datosBusqueda.map((item) => (
                        <tr key={item.id_registro} className="hover:bg-white/5 transition-colors text-xs md:text-sm">
                          <td className="p-4 font-mono font-bold text-indigo-400">#{item.consecutivo_ticket}</td>
                          <td className="p-4 text-slate-400">{item.fecha_registro?.substring(0, 10)}</td>
                          <td className="p-4 font-bold text-white">{item.placa}</td>
                          <td className="p-4 text-right font-mono font-bold text-emerald-400">{parseFloat(item.peso_neto_kg).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">No se encontraron registros.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}