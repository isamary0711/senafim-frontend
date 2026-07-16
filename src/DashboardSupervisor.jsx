import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, LogOut, Clock, Menu, X, TrendingUp, Truck, Database, Search, Download, Calendar } from 'lucide-react';

export default function DashboardSupervisor() {
  const navigate = useNavigate();
  
  // === SISTEMA DE NAVEGACIÓN Y RESPONSIVE ===
  const [vistaActiva, setVistaActiva] = useState('panel'); 
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fechaActual, setFechaActual] = useState(new Date());

  // === ESTADOS DE DATOS ===
  const [historialGlobal, setHistorialGlobal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // === ESTADO PARA REPORTES ===
  const [filtroTiempo, setFiltroTiempo] = useState('diario'); // 'diario', 'semanal', 'mensual', 'historico'

  // === KPIs (Métricas) ===
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

  // Recalcular KPIs cuando cambia el historial global o el filtro de tiempo
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
      
      if (respuesta.ok) {
        setHistorialGlobal(datos);
      }
    } catch (error) {
      console.error('Error cargando auditoría:', error);
    } finally {
      setCargando(false);
    }
  };

  // === LÓGICA DE FILTRADO POR TIEMPO ===
  const filtrarDatosPorTiempo = (datos, filtro) => {
    const hoy = new Date();
    const hoyISO = hoy.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const mesActual = hoyISO.substring(0, 7); // "YYYY-MM"
    
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    const hace7DiasISO = hace7Dias.toISOString().split('T')[0];

    return datos.filter(item => {
      // Si la fecha viene nula, la omitimos
      if (!item.fecha_registro) return false;
      
      // Extraemos solo la parte YYYY-MM-DD
      const fechaRegistro = item.fecha_registro.split('T')[0]; 

      switch (filtro) {
        case 'diario':
          return fechaRegistro === hoyISO;
        case 'semanal':
          return fechaRegistro >= hace7DiasISO && fechaRegistro <= hoyISO;
        case 'mensual':
          return fechaRegistro.startsWith(mesActual);
        case 'historico':
        default:
          return true;
      }
    });
  };

  const calcularKPIs = (datos) => {
    const totalViajes = datos.length;
    const totalKg = datos.reduce((acc, curr) => acc + parseFloat(curr.peso_neto_kg || 0), 0);
    const totalToneladas = totalKg / 1000;
    const promedio = totalViajes > 0 ? (totalToneladas / totalViajes) : 0;

    setMetricas({
      totalViajes,
      totalToneladas: totalToneladas.toFixed(2),
      promedioCarga: promedio.toFixed(2)
    });
  };

  // === MOTOR DE EXPORTACIÓN A EXCEL (CSV) ===
  const exportarExcel = () => {
    const datosFiltrados = filtrarDatosPorTiempo(historialGlobal, filtroTiempo);
    
    if (datosFiltrados.length === 0) {
      alert("No hay datos en este periodo para exportar.");
      return;
    }

    // Cabeceras del Excel
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "TICKET,FECHA,HORA,PLACA,CHOFER,MINA,COMPRADOR,PESO BRUTO(KG),TARA(KG),PESO NETO(KG)\n";

    // Filas de datos
    datosFiltrados.forEach(row => {
      const fecha = row.fecha_registro ? row.fecha_registro.split('T')[0] : 'N/A';
      const hora = row.hora_registro ? row.hora_registro.substring(0, 5) : 'N/A';
      // Limpiamos comas para no romper el CSV
      const linea = `${row.consecutivo_ticket},${fecha},${hora},${row.placa},${row.chofer || 'N/A'},"${row.mina || ''}","${row.comprador || ''}",${row.peso_bruto_kg || 0},${row.peso_tara_kg || 0},${row.peso_neto_kg || 0}`;
      csvContent += linea + "\n";
    });

    // Crear el archivo y forzar descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Pesajes_${filtroTiempo.toUpperCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Buscador para la tabla de auditoría (aplica sobre el historial global)
  const datosBusqueda = historialGlobal.filter(item => 
    item.placa?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.numero_guia?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.consecutivo_ticket?.toString().includes(busqueda)
  );

  return (
    <div className="min-h-screen bg-[#050B14] font-sans text-slate-300 flex overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* === OVERLAY MÓVIL === */}
      {menuAbierto && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setMenuAbierto(false)} />
      )}

      {/* === BARRA LATERAL === */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A162C]/95 backdrop-blur-xl border-r border-indigo-900/30 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-indigo-900/30 flex justify-between items-center lg:justify-center">
          <img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-8 lg:h-10 object-contain" />
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMenuAbierto(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 flex-1 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-indigo-500/70 uppercase tracking-widest mb-4 px-4">Panel Gerencial</div>
          <button onClick={() => { setVistaActiva('panel'); setMenuAbierto(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${vistaActiva === 'panel' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-indigo-400'}`}>
            <LayoutDashboard className="w-5 h-5" /> <span>Métricas (KPIs)</span>
          </button>
          <button onClick={() => { setVistaActiva('auditoria'); setMenuAbierto(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${vistaActiva === 'auditoria' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-indigo-400'}`}>
            <ShieldCheck className="w-5 h-5" /> <span>Auditoría de Pesajes</span>
          </button>
        </div>

        <div className="p-6 border-t border-indigo-900/30">
          <button onClick={handleCerrarSesion} className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-400 py-2.5 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors">
            <LogOut className="w-4 h-4" /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden w-full">
        {/* === CABECERA === */}
        <header className="h-16 lg:h-20 bg-[#050B14]/80 backdrop-blur-md border-b border-indigo-900/30 flex justify-between items-center px-4 lg:px-8 shrink-0">
          <div className="flex items-center">
            <button className="mr-3 text-slate-300 hover:text-white lg:hidden" onClick={() => setMenuAbierto(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-sm lg:text-xl font-bold text-white tracking-tight uppercase">Módulo Supervisor</h1>
              <p className="text-[10px] lg:text-xs text-indigo-400 font-mono hidden sm:block">Nivel de Acceso: ADMINISTRATIVO</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-900/20 border border-indigo-500/20 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">
            <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-indigo-400" />
            <span className="text-xs lg:text-sm font-mono text-indigo-100">{fechaActual.toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
          
          {/* ========================================= */}
          {/* VISTA 1: PANEL DE MÉTRICAS Y REPORTES     */}
          {/* ========================================= */}
          {vistaActiva === 'panel' && (
            <div className="space-y-6 lg:space-y-8 h-full animate-fade-in">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-0">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white">Resumen Operativo</h2>
                  <p className="text-slate-400 text-sm">Filtra las métricas y exporta reportes financieros.</p>
                </div>
                
                {/* CONTROLES DE REPORTE Y FILTRO */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center bg-[#0A162C] border border-indigo-500/30 rounded-lg p-1">
                    <Calendar className="w-4 h-4 text-indigo-400 ml-2" />
                    <select 
                      value={filtroTiempo} 
                      onChange={(e) => setFiltroTiempo(e.target.value)}
                      className="bg-transparent text-white text-sm outline-none px-3 py-1.5 cursor-pointer"
                    >
                      <option value="diario">Hoy (Diario)</option>
                      <option value="semanal">Últimos 7 Días</option>
                      <option value="mensual">Mes Actual</option>
                      <option value="historico">Histórico Total</option>
                    </select>
                  </div>

                  <button onClick={exportarExcel} className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center shadow-lg shadow-emerald-900/20 border border-emerald-500">
                    <Download className="w-4 h-4 mr-2" /> Exportar Reporte
                  </button>
                  
                  <button onClick={cargarDatosGlobales} className="flex-1 lg:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center shadow-lg shadow-indigo-900/50">
                     Actualizar
                  </button>
                </div>
              </div>

              {/* TARJETAS KPI (Ahora son Dinámicas según el filtro) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-gradient-to-br from-indigo-900/40 to-[#0A162C] border border-indigo-500/30 p-6 rounded-2xl shadow-xl relative overflow-hidden transition-all">
                  <div className="absolute -right-4 -top-4 opacity-10"><Database className="w-32 h-32 text-indigo-400" /></div>
                  <div className="flex items-center space-x-3 mb-2 relative z-10">
                    <div className="p-2 bg-indigo-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-indigo-400" /></div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Volumen Extraído</h3>
                  </div>
                  <div className="mt-4 relative z-10 flex items-baseline space-x-2">
                    <span className="text-4xl lg:text-5xl font-black text-white">{metricas.totalToneladas}</span>
                    <span className="text-indigo-400 font-bold">Ton</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-[#0A162C] border border-blue-500/30 p-6 rounded-2xl shadow-xl relative overflow-hidden transition-all">
                  <div className="absolute -right-4 -top-4 opacity-10"><Truck className="w-32 h-32 text-blue-400" /></div>
                  <div className="flex items-center space-x-3 mb-2 relative z-10">
                    <div className="p-2 bg-blue-500/20 rounded-lg"><Truck className="w-5 h-5 text-blue-400" /></div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total de Viajes</h3>
                  </div>
                  <div className="mt-4 relative z-10 flex items-baseline space-x-2">
                    <span className="text-4xl lg:text-5xl font-black text-white">{metricas.totalViajes}</span>
                    <span className="text-blue-400 font-bold">Tickets</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/40 to-[#0A162C] border border-emerald-500/30 p-6 rounded-2xl shadow-xl relative overflow-hidden transition-all">
                  <div className="absolute -right-4 -top-4 opacity-10"><ShieldCheck className="w-32 h-32 text-emerald-400" /></div>
                  <div className="flex items-center space-x-3 mb-2 relative z-10">
                    <div className="p-2 bg-emerald-500/20 rounded-lg"><Scale className="w-5 h-5 text-emerald-400" /></div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Promedio / Carga</h3>
                  </div>
                  <div className="mt-4 relative z-10 flex items-baseline space-x-2">
                    <span className="text-4xl lg:text-5xl font-black text-white">{metricas.promedioCarga}</span>
                    <span className="text-emerald-400 font-bold">Ton/Viaje</span>
                  </div>
                </div>
              </div>

              {/* VISTA PREVIA TABLA (Del periodo seleccionado) */}
              <div className="bg-[#0A162C]/80 border border-white/5 rounded-2xl p-6 shadow-2xl mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">Vista Previa del Reporte</h3>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase">
                    {filtroTiempo}
                  </span>
                </div>
                
                {cargando ? (
                   <div className="text-center py-6 text-slate-400 animate-pulse">Cargando métricas...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="text-xs uppercase tracking-widest text-slate-500 border-b border-white/10">
                          <th className="pb-3 font-semibold">Fecha/Hora</th>
                          <th className="pb-3 font-semibold">Ticket</th>
                          <th className="pb-3 font-semibold">Placa</th>
                          <th className="pb-3 font-semibold">Mina Origen</th>
                          <th className="pb-3 font-semibold text-right">Peso Neto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filtrarDatosPorTiempo(historialGlobal, filtroTiempo).slice(0, 5).map((pesaje) => (
                          <tr key={pesaje.id_registro} className="text-sm">
                            <td className="py-3 text-slate-400">{pesaje.fecha_registro?.substring(0, 10)}</td>
                            <td className="py-3 font-mono text-indigo-400">#{pesaje.consecutivo_ticket}</td>
                            <td className="py-3 font-bold text-white">{pesaje.placa}</td>
                            <td className="py-3 text-slate-400">{pesaje.mina}</td>
                            <td className="py-3 font-mono font-bold text-emerald-400 text-right">{parseFloat(pesaje.peso_neto_kg).toLocaleString()} KG</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filtrarDatosPorTiempo(historialGlobal, filtroTiempo).length === 0 && (
                      <div className="text-center py-4 text-slate-500 text-sm">No hay registros en este periodo.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* VISTA 2: AUDITORÍA GENERAL                */}
          {/* ========================================= */}
          {vistaActiva === 'auditoria' && (
            <div className="bg-[#0A162C]/80 border border-white/10 rounded-2xl lg:rounded-[2rem] p-4 lg:p-8 shadow-2xl relative animate-fade-in h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl lg:rounded-t-[2rem]"></div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
                    <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-indigo-500" /> Centro de Auditoría
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Inspección de todos los registros históricos del sistema.</p>
                </div>

                <div className="flex w-full lg:w-auto gap-3">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar placa o ticket..." 
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full bg-[#050B14] border border-white/10 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {cargando ? (
                <div className="text-center py-10 text-slate-400 animate-pulse text-sm lg:text-base">Sincronizando con base de datos...</div>
              ) : datosBusqueda.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm lg:text-base">No se encontraron registros para la búsqueda.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/5 flex-1 custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-[#050B14] z-10">
                      <tr className="text-[10px] lg:text-xs uppercase tracking-widest text-indigo-300/70 border-b border-indigo-900/30">
                        <th className="p-3 lg:p-4 font-semibold whitespace-nowrap">Ticket</th>
                        <th className="p-3 lg:p-4 font-semibold">Fecha/Hora</th>
                        <th className="p-3 lg:p-4 font-semibold">Placa</th>
                        <th className="p-3 lg:p-4 font-semibold whitespace-nowrap">Guía</th>
                        <th className="p-3 lg:p-4 font-semibold">Origen / Destino</th>
                        <th className="p-3 lg:p-4 font-semibold text-right text-emerald-400 whitespace-nowrap">Neto (Kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {datosBusqueda.map((pesaje) => (
                        <tr key={pesaje.id_registro} className="hover:bg-white/5 transition-colors text-xs lg:text-sm">
                          <td className="p-3 lg:p-4 font-mono font-bold text-indigo-400">#{pesaje.consecutivo_ticket}</td>
                          <td className="p-3 lg:p-4 text-slate-400">
                            <div className="font-medium text-slate-300">{pesaje.fecha_registro?.substring(0, 10)}</div>
                            <div className="text-[10px]">{pesaje.hora_registro?.substring(0, 5)}</div>
                          </td>
                          <td className="p-3 lg:p-4 font-bold text-white whitespace-nowrap">{pesaje.placa}</td>
                          <td className="p-3 lg:p-4 font-mono text-slate-400">{pesaje.numero_guia}</td>
                          <td className="p-3 lg:p-4">
                            <div className="text-slate-300 truncate max-w-[200px]">{pesaje.mina}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{pesaje.comprador}</div>
                          </td>
                          <td className="p-3 lg:p-4 font-mono font-bold text-emerald-400 text-right">
                            {parseFloat(pesaje.peso_neto_kg).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}