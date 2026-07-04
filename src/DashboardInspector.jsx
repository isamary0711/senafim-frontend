import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building, Activity, LogOut, Bell, ShieldCheck, Briefcase, FileText, CheckCircle, Plus, Trash2, Search, X, Scale, Truck, CalendarDays, AlertTriangle, Camera, ClipboardList, Eye, MapPin } from 'lucide-react';

export default function DashboardInspector() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('auditoria');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  // === DATA ACTUALIZADA CON ORIGEN Y DESTINO PARA EL INSPECTOR ===
  const registrosPesaje = [
    { id: 'TKT-089', placa: 'A12BCD', chofer: 'Juan Pérez', vehiculo: 'Gandola G-40', pesoBruto: 32500, tara: 12000, neto: 20500, estado: 'Aprobado', hora: '08:45 AM', fiscal: 'L. Ramírez', origen: 'Poligonal Norte', destino: 'Cementera Táchira' },
    { id: 'TKT-090', placa: 'X98YZA', chofer: 'Pedro Gómez', vehiculo: 'Volqueta V-12', pesoBruto: 34100, tara: 12500, neto: 21600, estado: 'Aprobado', hora: '09:12 AM', fiscal: 'L. Ramírez', origen: 'Poligonal Sur', destino: 'Cementera Táchira' },
    { id: 'TKT-091', placa: 'M45JKL', chofer: 'Roberto Díaz', vehiculo: 'Gandola G-40', pesoBruto: 35000, tara: 12000, neto: 23000, estado: 'Discrepancia', hora: '09:30 AM', fiscal: 'A. Silva', origen: 'Almacén Central', destino: 'Puerto Maracaibo' },
    { id: 'TKT-092', placa: 'P77QWE', chofer: 'Luis Rivas', vehiculo: 'Volqueta V-12', pesoBruto: 31200, tara: 11800, neto: 19400, estado: 'Aprobado', hora: '10:05 AM', fiscal: 'L. Ramírez', origen: 'Poligonal Norte', destino: 'Termoeléctrica' },
  ];

  const postulantes = [
    { id: 1, nombre: 'Carlos Mendoza', cargo: 'Operador de Báscula', fecha: 'Hoy', email: 'carlos.m@email.com' },
    { id: 2, nombre: 'Ana Silva', cargo: 'Ingeniera IT', fecha: 'Ayer', email: 'ana.silva@email.com' },
  ];

  const reportesSupervisor = [
    { id: 'REP-001', supervisor: 'Ing. Marcos Ruiz', mina: 'Sector Norte', fecha: 'Hoy', estado: 'Pendiente', hallazgos: 'Se observa incremento en la pureza del carbón. Vías de acceso estables.' },
    { id: 'REP-002', supervisor: 'Ing. Marcos Ruiz', mina: 'Sector Sur', fecha: 'Ayer', estado: 'Verificado', hallazgos: 'Mantenimiento preventivo en maquinaria pesada completado.' }
  ];

  const abrirAuditoria = (ticket) => {
    setTicketSeleccionado(ticket);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050B14] font-sans text-slate-300 flex overflow-hidden selection:bg-amber-500 selection:text-slate-900 relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A162C]/80 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
        <div className="p-6 border-b border-white/5 flex justify-center"><img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-10 object-contain" /></div>
        <div className="p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Auditoría Total</p>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('auditoria')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'auditoria' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><Activity className="w-5 h-5" /> <span>Báscula</span></button>
            <button onClick={() => setActiveTab('reportes-campo')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reportes-campo' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><Camera className="w-5 h-5" /> <span>Reportes Campo</span></button>
            <button onClick={() => setActiveTab('empleos')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'empleos' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><Briefcase className="w-5 h-5" /> <span>RRHH</span></button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-white/5">
          <div className="flex items-center space-x-3 mb-4"><ShieldCheck className="w-6 h-6 text-amber-500" /> <span className="text-sm font-bold text-white">Inspector Jefe</span></div>
          <button onClick={() => navigate('/')} className="w-full text-xs bg-red-500/10 text-red-400 py-2 rounded-lg border border-red-500/20">CERRAR SISTEMA</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-[#050B14]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-8">
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">
            {activeTab === 'auditoria' ? 'Control de Pesaje de Mineral' : activeTab === 'reportes-campo' ? 'Verificación de Campo (Supervisor)' : 'Gestión de Talento'}
          </h1>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {activeTab === 'auditoria' ? (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl">
                  <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Total Neto Fiscalizado</p>
                  <h3 className="text-3xl font-bold text-white">124.8 <span className="text-sm text-slate-500 font-normal">Ton</span></h3>
                </div>
                <div className="bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl"><p className="text-slate-400 text-xs mb-1 uppercase">Alertas</p><h3 className="text-3xl font-bold text-amber-400">2</h3></div>
                <div className="bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl col-span-2 flex items-center justify-between">
                  <div className="flex-1"><p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Flujo Camiones</p><div className="w-full bg-white/5 h-2 rounded-full mt-3 overflow-hidden"><div className="w-[75%] h-full bg-blue-500"></div></div></div>
                  <span className="text-3xl font-bold text-white ml-6">18 / 24</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* TABLA PRINCIPAL */}
                <div className="lg:col-span-2 bg-[#0A162C]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center"><h3 className="font-bold text-lg text-white">Registros de Pesaje en Tiempo Real</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                      <thead className="bg-white/5 text-slate-300 font-semibold uppercase tracking-wider text-xs">
                        <tr>
                          <th className="px-6 py-4">Ticket</th>
                          <th className="px-6 py-4">Vehículo</th>
                          <th className="px-6 py-4">Ruta (Origen - Destino)</th>
                          <th className="px-6 py-4">Neto (Kg)</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4 text-center">Auditar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {registrosPesaje.map((reg) => (
                          <tr key={reg.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 text-white font-mono font-medium">{reg.id}</td>
                            <td className="px-6 py-4"><div className="text-white font-medium">{reg.vehiculo}</div><div className="text-xs text-slate-500 font-mono">{reg.placa}</div></td>
                            
                            {/* NUEVA COLUMNA VISIBLE PARA EL INSPECTOR */}
                            <td className="px-6 py-4 text-xs">
                              <span className="text-blue-400 font-bold">{reg.origen}</span> 
                              <span className="text-slate-500 mx-1">➔</span> 
                              <span className="text-amber-400 font-bold">{reg.destino}</span>
                            </td>

                            <td className="px-6 py-4 text-amber-400 font-bold text-base">{reg.neto.toLocaleString()}</td>
                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${reg.estado === 'Aprobado' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{reg.estado}</span></td>
                            <td className="px-6 py-4 text-center"><button onClick={() => abrirAuditoria(reg)} className="p-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Search className="w-4 h-4" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#0A162C]/80 border border-white/10 rounded-2xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
                  <Scale className="w-10 h-10 text-blue-400 mb-6" /><h3 className="font-bold text-white text-xl mb-4">Estado de Básculas</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"><span>Romana Principal</span><span className="text-green-400 font-semibold">Operativa</span></div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'reportes-campo' ? (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
              <div className="bg-[#0A162C]/80 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5"><h3 className="font-bold text-lg text-white">Reportes Enviados por Supervisión</h3></div>
                <div className="divide-y divide-white/5">
                  {reportesSupervisor.map((rep) => (
                    <div key={rep.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                      <div className="flex items-center space-x-6"><ClipboardList className="w-6 h-6 text-amber-400" /><div><h4 className="text-white font-bold">{rep.mina} - <span className="text-amber-500">{rep.id}</span></h4><p className="text-sm text-slate-400">Enviado por: {rep.supervisor}</p></div></div>
                      <div className="flex items-center space-x-4"><span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full text-xs font-bold">{rep.estado}</span><button onClick={() => alert('Detalle de reporte...')} className="p-2 bg-white/5 rounded-lg"><Eye className="w-5 h-5" /></button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 relative z-10 animate-in fade-in duration-500">
              <div className="lg:col-span-2 bg-[#0A162C]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"><div className="p-6 border-b border-white/5"><h3 className="font-bold text-lg text-white">Bandeja de CVs</h3></div></div>
            </div>
          )}
        </div>
      </main>

      {/* ================= DRAWER DE AUDITORÍA DETALLADA ================= */}
      {isDrawerOpen && ticketSeleccionado && (
        <div className="fixed inset-0 bg-[#050B14]/80 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="w-full max-w-xl bg-[#0A162C] h-full shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-white/10 relative z-10 flex flex-col animate-in slide-in-from-right duration-500 ease-out">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0C1B35]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center"><ShieldCheck className="w-7 h-7" /></div>
                <div><h3 className="text-white font-bold text-xl">Auditoría: <span className="font-mono text-amber-400">{ticketSeleccionado.id}</span></h3><p className="text-sm text-slate-400">Trazabilidad de Pesaje Logístico</p></div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6 text-sm">
              {/* NUEVO MÓDULO VISUAL: RUTA DE TRAZABILIDAD EN EL DRAWER */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center"><MapPin className="w-4 h-4 mr-1 text-blue-500" /> Verificación de Ruta Logística</p>
                <div className="flex items-center justify-between bg-[#050B14] p-4 rounded-xl border border-white/5 font-mono text-center">
                  <div className="flex-1"><p className="text-[10px] text-slate-500">Mina (Origen)</p><p className="text-sm font-bold text-blue-400 mt-1 uppercase">{ticketSeleccionado.origen}</p></div>
                  <div className="px-4 text-slate-600 animate-pulse">➔➔➔</div>
                  <div className="flex-1"><p className="text-[10px] text-slate-500">Destino Certificado</p><p className="text-sm font-bold text-amber-400 mt-1 uppercase">{ticketSeleccionado.destino}</p></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl"><p className="text-slate-500 text-xs">Vehículo</p><p className="text-white font-medium mt-1">{ticketSeleccionado.vehiculo} ({ticketSeleccionado.placa})</p></div>
                <div className="bg-white/5 p-4 rounded-xl"><p className="text-slate-500 text-xs">Chofer</p><p className="text-white font-medium mt-1">{ticketSeleccionado.chofer}</p></div>
              </div>

              <div className="bg-[#050B14] border border-white/10 p-6 rounded-2xl text-center">
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-slate-500 text-xs">Bruto</p><p className="text-xl font-bold text-white">{ticketSeleccionado.pesoBruto.toLocaleString()} Kg</p></div>
                  <div><p className="text-slate-500 text-xs">Tara</p><p className="text-xl font-bold text-white">{ticketSeleccionado.tara.toLocaleString()} Kg</p></div>
                  <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20"><p className="text-amber-400 text-xs font-bold">Neto</p><p className="text-xl font-black text-amber-300">{ticketSeleccionado.neto.toLocaleString()} Kg</p></div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0C1B35] grid grid-cols-2 gap-4">
              <button onClick={() => setIsDrawerOpen(false)} className="bg-slate-800 text-slate-300 py-3 rounded-xl font-bold">Cerrar</button>
              <button onClick={() => { alert('Certificado'); setIsDrawerOpen(false); }} className="bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-900/30">Aprobar Ticket</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}