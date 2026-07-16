import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut, ShieldCheck, Camera, X, Eye, Menu } from 'lucide-react';

export default function DashboardInspector() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('auditoria');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  const registrosPesaje = [
    { id: 'TKT-089', placa: 'A12BCD', chofer: 'Juan Pérez', vehiculo: 'Gandola G-40', pesoBruto: 32500, tara: 12000, neto: 20500, estado: 'Aprobado', origen: 'Poligonal Norte', destino: 'Cementera Táchira' },
    { id: 'TKT-091', placa: 'M45JKL', chofer: 'Roberto Díaz', vehiculo: 'Gandola G-40', pesoBruto: 35000, tara: 12000, neto: 23000, estado: 'Discrepancia', origen: 'Almacén Central', destino: 'Puerto Maracaibo' },
  ];

  return (
    <div className="min-h-screen bg-[#050B14] flex text-slate-300">
      {/* Overlay para cerrar sidebar en móvil */}
      {menuAbierto && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMenuAbierto(false)}></div>}

      {/* Sidebar - Oculto en móvil, visible en escritorio */}
      <aside className={`fixed lg:relative z-40 w-64 h-screen bg-[#0A162C] border-r border-white/5 transition-transform ${menuAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <img src="/assets/senafim-logo-blanco.png" alt="Logo" className="h-8" />
            <button className="lg:hidden" onClick={() => setMenuAbierto(false)}><X/></button>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab('auditoria')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'auditoria' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Activity size={20}/> <span>Báscula</span></button>
        </nav>
        <div className="absolute bottom-0 w-full p-6">
            <button onClick={() => navigate('/')} className="w-full text-red-400 bg-red-500/10 py-2 rounded border border-red-500/20 flex items-center justify-center gap-2"><LogOut size={16}/> Salir</button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center px-6 border-b border-white/5">
          <button className="lg:hidden mr-4" onClick={() => setMenuAbierto(true)}><Menu/></button>
          <h1 className="font-bold text-white uppercase text-sm md:text-lg">Auditoría de Mineral</h1>
        </header>

        <div className="p-4 md:p-8 overflow-y-auto">
          {/* Stats responsivas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0A162C] p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Total Neto</p>
                <h3 className="text-xl font-bold text-white">124.8 Ton</h3>
            </div>
            {/* Otros stats... */}
          </div>

          {/* Tabla con scroll horizontal en móvil */}
          <div className="bg-[#0A162C] rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-white/5 uppercase text-slate-400">
                        <tr>
                            <th className="p-4">Ticket</th>
                            <th className="p-4 hidden sm:table-cell">Placa</th>
                            <th className="p-4">Ruta</th>
                            <th className="p-4 text-right">Neto</th>
                            <th className="p-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {registrosPesaje.map((reg) => (
                            <tr key={reg.id}>
                                <td className="p-4 font-bold text-white">{reg.id}</td>
                                <td className="p-4 hidden sm:table-cell">{reg.placa}</td>
                                <td className="p-4 text-xs">{reg.origen} ➔ {reg.destino}</td>
                                <td className="p-4 text-right text-amber-400 font-bold">{reg.neto}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => { setTicketSeleccionado(reg); setIsDrawerOpen(true); }} className="p-2 bg-blue-600/10 text-blue-400 rounded"><Eye size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </main>

      {/* Drawer de auditoría mejorado */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsDrawerOpen(false)}></div>
            <div className="w-full max-w-sm bg-[#0A162C] h-full shadow-2xl p-6">
                <h2 className="font-bold text-white mb-4">Auditoría: {ticketSeleccionado.id}</h2>
                <div className="space-y-4">
                    <div className="bg-[#050B14] p-4 rounded text-sm text-white font-mono">{ticketSeleccionado.origen} ➔ {ticketSeleccionado.destino}</div>
                    <div className="text-3xl font-black text-amber-400">{ticketSeleccionado.neto.toLocaleString()} KG</div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="w-full mt-8 bg-blue-600 py-3 rounded text-white font-bold">Cerrar</button>
            </div>
        </div>
      )}
    </div>
  );
}