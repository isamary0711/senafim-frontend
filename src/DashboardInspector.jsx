import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut, ShieldCheck, Briefcase, Camera, ClipboardList, Eye, MapPin, X, Scale, Menu } from 'lucide-react';

export default function DashboardInspector() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('auditoria');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  const registrosPesaje = [
    { id: 'TKT-089', placa: 'A12BCD', chofer: 'Juan Pérez', vehiculo: 'Gandola G-40', pesoBruto: 32500, tara: 12000, neto: 20500, estado: 'Aprobado', hora: '08:45 AM', origen: 'Poligonal Norte', destino: 'Cementera Táchira' },
    { id: 'TKT-091', placa: 'M45JKL', chofer: 'Roberto Díaz', vehiculo: 'Gandola G-40', pesoBruto: 35000, tara: 12000, neto: 23000, estado: 'Discrepancia', hora: '09:30 AM', origen: 'Almacén Central', destino: 'Puerto Maracaibo' },
  ];

  return (
    <div className="min-h-screen bg-[#050B14] font-sans text-slate-300 flex overflow-hidden">
      
      {/* Sidebar Responsive */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A162C]/95 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform lg:translate-x-0 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <img src="/assets/senafim-logo-blanco.png" alt="Logo" className="h-8 object-contain" />
          <button className="lg:hidden" onClick={() => setMenuAbierto(false)}><X className="text-white"/></button>
        </div>
        <div className="p-4 flex-1 space-y-2">
          <button onClick={() => {setActiveTab('auditoria'); setMenuAbierto(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${activeTab === 'auditoria' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Activity className="w-5 h-5" /> <span>Báscula</span></button>
          <button onClick={() => {setActiveTab('reportes-campo'); setMenuAbierto(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${activeTab === 'reportes-campo' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}><Camera className="w-5 h-5" /> <span>Reportes</span></button>
        </div>
        <div className="p-6 border-t border-white/5">
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-400 py-2 rounded-lg border border-red-500/20"><LogOut className="w-4 h-4" /> <span>Salir</span></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-[#050B14]/80 border-b border-white/5 flex items-center px-4 lg:px-8">
          <button className="lg:hidden mr-4" onClick={() => setMenuAbierto(true)}><Menu className="text-white" /></button>
          <h1 className="text-lg font-bold text-white uppercase truncate">Control de Pesaje de Mineral</h1>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
          {/* Grid de Stats Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0A162C]/80 border border-white/10 p-5 rounded-2xl">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Total Neto Fiscalizado</p>
              <h3 className="text-2xl font-bold text-white">124.8 <span className="text-xs text-slate-500">Ton</span></h3>
            </div>
            <div className="bg-[#0A162C]/80 border border-white/10 p-5 rounded-2xl">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Alertas Activas</p>
              <h3 className="text-2xl font-bold text-amber-400">2</h3>
            </div>
          </div>

          {/* Tabla Responsive */}
          <div className="bg-[#0A162C]/80 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Ticket</th>
                    <th className="px-4 py-3 hidden md:table-cell">Vehículo</th>
                    <th className="px-4 py-3">Ruta</th>
                    <th className="px-4 py-3 text-right">Neto (Kg)</th>
                    <th className="px-4 py-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrosPesaje.map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5">
                      <td className="px-4 py-4 text-white font-bold">{reg.id}</td>
                      <td className="px-4 py-4 hidden md:table-cell">{reg.placa}</td>
                      <td className="px-4 py-4 text-xs"><span className="text-blue-400">{reg.origen}</span> ➔ <span className="text-amber-400">{reg.destino}</span></td>
                      <td className="px-4 py-4 text-right text-amber-400 font-bold">{reg.neto.toLocaleString()}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => { setTicketSeleccionado(reg); setIsDrawerOpen(true); }} className="p-2 bg-blue-600/10 text-blue-400 rounded-lg"><Eye size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Drawer de Auditoría Detallada (Responsivo) */}
      {isDrawerOpen && ticketSeleccionado && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="w-full max-w-md bg-[#0A162C] h-full border-l border-white/10 p-6 shadow-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Detalle Auditoría: {ticketSeleccionado.id}</h2>
            
            <div className="space-y-4 flex-1">
              <div className="bg-[#050B14] p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase">Origen ➔ Destino</p>
                <p className="text-sm font-bold text-white">{ticketSeleccionado.origen} ➔ {ticketSeleccionado.destino}</p>
              </div>
              <div className="bg-[#050B14] p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase">Peso Neto</p>
                <p className="text-2xl font-black text-amber-400">{ticketSeleccionado.neto.toLocaleString()} KG</p>
              </div>
            </div>
            
            <button onClick={() => setIsDrawerOpen(false)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4">Aprobar Certificación</button>
          </div>
        </div>
      )}
    </div>
  );
}