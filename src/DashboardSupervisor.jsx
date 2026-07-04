import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, BarChart3, Users, LogOut, Bell, ShieldCheck, Activity, Calendar, Download, Camera, ClipboardList, MapPin, Send } from 'lucide-react';

export default function DashboardSupervisor() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  const [enviando, setEnviando] = useState(false);

  const dataProduccion = [
    { dia: 'Lun', toneladas: 120, meta: 100 },
    { dia: 'Mar', toneladas: 135, meta: 100 },
    { dia: 'Mié', toneladas: 95, meta: 100 },
    { dia: 'Jue', toneladas: 150, meta: 100 },
    { dia: 'Vie', toneladas: 180, meta: 100 },
    { dia: 'Sáb', toneladas: 110, meta: 100 },
    { dia: 'Dom', toneladas: 85, meta: 100 },
  ];

  const dataEficiencia = [
    { hora: '08:00', RomanaPrincipal: 24, RomanaAuxiliar: 12 },
    { hora: '10:00', RomanaPrincipal: 35, RomanaAuxiliar: 15 },
    { hora: '12:00', RomanaPrincipal: 40, RomanaAuxiliar: 10 },
    { hora: '14:00', RomanaPrincipal: 28, RomanaAuxiliar: 22 },
    { hora: '16:00', RomanaPrincipal: 32, RomanaAuxiliar: 18 },
  ];

  // === FUNCIÓN REAL DE DESCARGA DE ARCHIVO ===
  const descargarReporte = () => {
    const textoReporte = `
==================================================
        SENAFIM TÁCHIRA - REPORTES GENERALES
    SISTEMA DE CONTROL DE PRODUCCIÓN MINERA LA ROMANA
==================================================
Fecha de Emisión: ${new Date().toLocaleDateString()}
Generado por: Supervisor General

REPORTE DE RENDIMIENTO SEMANAL:
--------------------------------------------------
- Lunes: 120 Ton (Meta: 100 Ton)
- Martes: 135 Ton (Meta: 100 Ton)
- Miércoles: 95 Ton (Meta: 100 Ton)
- Jueves: 150 Ton (Meta: 100 Ton)
- Viernes: 180 Ton (Meta: 100 Ton)
- Sábado: 110 Ton (Meta: 100 Ton)
- Domingo: 85 Ton (Meta: 100 Ton)

Métricas Globales:
- Producción Total Semanal: 875 Ton
- Cumplimiento de Meta Mensual: 84%
- Estado General: OPERATIVO EN RANGO OPTIMO

--------------------------------------------------
Firma Digital de Validación: [SENAFIM-SUP-VALIDADO]
==================================================
`;
    
    const blob = new Blob([textoReporte], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Produccion_SENAFIM_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A162C]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold flex items-center justify-between space-x-4">
              <span>{entry.name}:</span> <span>{entry.value} Ton</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      alert("Reporte de Campo enviado exitosamente al Inspector Jefe para su verificación.");
      setEnviando(false);
      setActiveTab('resumen');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050B14] font-sans text-slate-300 flex overflow-hidden selection:bg-amber-500 selection:text-slate-900">
      <aside className="w-64 bg-[#0A162C]/80 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
        <div className="p-6 border-b border-white/5 flex items-center justify-center"><img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-10 object-contain" /></div>
        <div className="p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Inteligencia de Negocios</p>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('resumen')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'resumen' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><TrendingUp className="w-5 h-5" /> <span>Rendimiento Global</span></button>
            <button onClick={() => setActiveTab('nuevo-reporte')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'nuevo-reporte' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><ClipboardList className="w-5 h-5" /> <span>Reporte de Campo</span></button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-white/5">
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-lg transition-colors border border-red-500/20"><LogOut className="w-4 h-4" /> <span>Cerrar Sesión</span></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        <header className="h-20 bg-[#050B14]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-8">
          <h1 className="text-xl font-bold text-white tracking-tight">{activeTab === 'resumen' ? 'Dashboard Gerencial' : 'Generar Reporte de Hallazgos en Mina'}</h1>
          <div className="flex items-center space-x-4">
            {/* AQUÍ ESTÁ EL BOTÓN DE DESCARGA CONECTADO */}
            <button onClick={descargarReporte} className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-4 py-2 rounded-lg transition-colors text-sm font-semibold shadow-lg">
              <Download className="w-4 h-4" /> <span>Descargar Datos (.TXT)</span>
            </button>
            <div className="relative p-2 bg-white/5 rounded-full border border-white/10 text-slate-300 cursor-pointer"><Bell className="w-5 h-5" /></div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {activeTab === 'resumen' ? (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider font-semibold flex items-center"><Activity className="w-4 h-4 mr-2 text-blue-400" /> Producción Semanal</p>
                  <h3 className="text-4xl font-extrabold text-white">875 <span className="text-base text-slate-500 font-normal">Ton</span></h3>
                </div>
                <div className="bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider font-semibold flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-amber-400" /> Camiones Despachados</p>
                  <h3 className="text-4xl font-extrabold text-white">42</h3>
                </div>
                <div className="bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl relative overflow-hidden group col-span-2 flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider font-semibold flex items-center"><Calendar className="w-4 h-4 mr-2 text-green-400" /> Meta Mensual</p>
                    <h3 className="text-4xl font-extrabold text-white">84%</h3>
                  </div>
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden mr-4"><div className="w-[84%] h-full bg-green-500"></div></div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl shadow-2xl">
                  <h3 className="font-bold text-lg text-white mb-6">Tendencia de Extracción de Carbón</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataProduccion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs><linearGradient id="colorTon" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="dia" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="toneladas" stroke="#3b82f6" strokeWidth={3} fill="url(#colorTon)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0A162C]/80 border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col">
                  <h3 className="font-bold text-lg text-white mb-6">Tráfico por Romana</h3>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataEficiencia} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="hora" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="RomanaPrincipal" name="R. Principal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="RomanaAuxiliar" name="R. Auxiliar" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
              <form onSubmit={handleSubmitReport} className="bg-[#0A162C] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Ubicación / Poligonal</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-amber-500" />
                      <select className="w-full bg-[#050B14] border border-white/10 pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white">
                        <option>La Gran Ubatera - Sector Norte</option>
                        <option>La Gran Ubatera - Sector Sur</option>
                        <option>La Romana - Área de Carga</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Fecha de Inspección</label><input type="date" className="w-full bg-[#050B14] border border-white/10 px-4 py-3 rounded-xl outline-none text-white" defaultValue={new Date().toISOString().split('T')[0]} /></div>
                </div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Descripción Detallada</label><textarea required className="w-full bg-[#050B14] border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none text-white" placeholder="Condiciones encontradas..."></textarea></div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Evidencia Fotográfica</label>
                  <div className="border-2 border-dashed border-white/10 bg-white/5 rounded-2xl p-10 text-center"><Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" /><p className="text-slate-300 font-medium">Subir fotos de la mina</p></div>
                </div>
                <button type="submit" disabled={enviando} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3"><span>{enviando ? 'SUBIENDO...' : 'ENVIAR REPORTE'}</span></button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}