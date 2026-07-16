import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Scale, LogOut, Clock, MapPin, FileText, QrCode, List, Activity, Menu, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function DashboardOperador() {
  const navigate = useNavigate();
  
  // === SISTEMA DE NAVEGACIÓN Y RESPONSIVE ===
  const [vistaActiva, setVistaActiva] = useState('registro'); // 'registro' o 'historial'
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para el menú lateral en móviles

  // === ESTADOS DEL FORMULARIO ===
  const [placa, setPlaca] = useState('CAM-001'); 
  const [chofer, setChofer] = useState('COND-001'); 
  const [pesoBruto, setPesoBruto] = useState('');
  const [tara, setTara] = useState('');
  const [pesoNeto, setPesoNeto] = useState(0);
  const [origen, setOrigen] = useState('MINA-NTE');
  const [destino, setDestino] = useState('COMP-001');
  const [numeroGuia, setNumeroGuia] = useState('');
  const [pesoGuia, setPesoGuia] = useState('');
  
  const [procesando, setProcesando] = useState(false);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [ticketGenerado, setTicketGenerado] = useState(null);

  // === ESTADO DEL HISTORIAL ===
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // Diccionarios para nombres reales
  const nombresCamiones = { 'CAM-001': 'GANDOLA-01', 'CAM-002': 'GANDOLA-02', 'CAM-003': 'VOLQUETA-01' };
  const nombresChoferes = { 'COND-001': 'Carlos Mendoza', 'COND-002': 'Miguel Antonio', 'COND-003': 'Jose Ramirez' };

  useEffect(() => {
    const timer = setInterval(() => setFechaActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const bruto = parseFloat(pesoBruto) || 0;
    const t = parseFloat(tara) || 0;
    const neto = bruto - t;
    setPesoNeto(neto > 0 ? neto : 0);
  }, [pesoBruto, tara]);

  useEffect(() => {
    if (vistaActiva === 'historial') {
      cargarHistorial();
    }
  }, [vistaActiva]);

  const cargarHistorial = async () => {
    setCargandoHistorial(true);
    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch('https://senafim-api.onrender.com/api/pesajes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setHistorial(datos);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleRegistrarPesaje = async (e) => {
    e.preventDefault();
    setProcesando(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Error: No hay sesión activa.');
        navigate('/');
        return;
      }

      const paqueteDatos = {
        codigo_alianza: 'ALZ-001', 
        codigo_conductor: chofer, 
        codigo_transporte: 'TRANS-001', 
        codigo_camion: placa, 
        codigo_mina: origen, 
        codigo_comprador: destino,
        peso_bruto_kg: parseFloat(pesoBruto),
        peso_tara_kg: parseFloat(tara),
        numero_guia: numeroGuia,
        peso_numero_guia_kg: parseFloat(pesoGuia),
        registro_fotografico_url: ''
      };

      const respuesta = await fetch('https://senafim-api.onrender.com/api/pesajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paqueteDatos)
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setTicketGenerado(datos.pesaje);
        alert(`¡Pesaje registrado!\nTicket ID: ${datos.pesaje.consecutivo_ticket}`);
        setPesoBruto(''); setTara(''); setNumeroGuia(''); setPesoGuia(''); setPesoNeto(0);
      } else {
        if (datos.detalles) {
          const mensajesError = datos.detalles.map(err => `• ${err.message}`).join('\n');
          alert(`ALERTA DE SEGURIDAD - Datos Inválidos:\n\n${mensajesError}`);
        } else {
          alert(`Acceso Denegado: ${datos.error}`);
        }
      }
    } catch (error) {
      alert('Error crítico de conexión.');
    } finally {
      setProcesando(false);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050B14] font-sans text-slate-300 flex overflow-hidden selection:bg-amber-500 selection:text-slate-900">
      
      {/* === OVERLAY MÓVIL === */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* === BARRA LATERAL (MENÚ) === */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A162C]/95 backdrop-blur-xl border-r border-white/5 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center lg:justify-center">
          <img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-8 lg:h-10 object-contain" />
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMenuAbierto(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 flex-1 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => { setVistaActiva('registro'); setMenuAbierto(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${vistaActiva === 'registro' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Scale className="w-5 h-5" /> <span>Registrar Carga</span>
          </button>
          
          <button 
            onClick={() => { setVistaActiva('historial'); setMenuAbierto(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${vistaActiva === 'historial' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <List className="w-5 h-5" /> <span>Historial del Día</span>
          </button>
        </div>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleCerrarSesion} className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-400 py-2.5 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors">
            <LogOut className="w-4 h-4" /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden w-full">
        {/* === CABECERA RESPONSIVE === */}
        <header className="h-16 lg:h-20 bg-[#050B14]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 lg:px-8 shrink-0">
          <div className="flex items-center">
            <button className="mr-3 text-slate-300 hover:text-white lg:hidden" onClick={() => setMenuAbierto(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm lg:text-xl font-bold text-white tracking-tight uppercase truncate max-w-[150px] sm:max-w-xs lg:max-w-none">
              {vistaActiva === 'registro' ? 'Captura de Pesos' : 'Operaciones'}
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">
            <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-400" />
            <span className="text-xs lg:text-sm font-mono text-white">{fechaActual.toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
          
          {/* ========================================= */}
          {/* VISTA 1: FORMULARIO DE REGISTRO           */}
          {/* ========================================= */}
          {vistaActiva === 'registro' && (
            <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 h-full">
              
              <div className="flex-1 bg-[#0A162C]/80 border border-white/10 rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-2xl relative order-2 xl:order-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-t-2xl lg:rounded-t-[2rem]"></div>
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 flex items-center"><Truck className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-400" /> Nuevo Registro</h2>

                <form onSubmit={handleRegistrarPesaje} className="space-y-4 lg:space-y-5">
                  
                  {/* === MENÚS DESPLEGABLES === */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 lg:mb-2">Placa del Vehículo</label>
                      <select value={placa} onChange={(e) => setPlaca(e.target.value)} className="w-full bg-[#050B14] text-white border border-white/10 px-4 py-3 lg:px-5 lg:py-3.5 rounded-xl font-mono text-lg lg:text-xl uppercase outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="CAM-001">GANDOLA-01</option>
                        <option value="CAM-002">GANDOLA-02</option>
                        <option value="CAM-003">VOLQUETA-01</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 lg:mb-2">Chofer Asignado</label>
                      <select value={chofer} onChange={(e) => setChofer(e.target.value)} className="w-full bg-[#050B14] text-white border border-white/10 px-4 py-3 lg:px-5 lg:py-3.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="COND-001">Carlos Mendoza</option>
                        <option value="COND-002">Miguel Antonio</option>
                        <option value="COND-003">Jose Ramirez</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 bg-white/5 p-4 lg:p-5 rounded-xl lg:rounded-2xl border border-white/5">
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5 lg:mb-2 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-blue-400" /> Origen del Carbón</label>
                      <select value={origen} onChange={(e) => setOrigen(e.target.value)} className="w-full bg-[#050B14] text-white border border-white/10 px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl outline-none text-sm lg:text-base">
                        <option value="MINA-NTE">Poligonal Norte (La Gran Ubatera)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5 lg:mb-2 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-amber-500" /> Destino del Carbón</label>
                      <select value={destino} onChange={(e) => setDestino(e.target.value)} className="w-full bg-[#050B14] text-white border border-white/10 px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl outline-none text-sm lg:text-base">
                        <option value="COMP-001">Industria / Cementera Táchira</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 bg-blue-900/10 p-4 lg:p-5 rounded-xl lg:rounded-2xl border border-blue-500/20">
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5 lg:mb-2 flex items-center"><FileText className="w-3.5 h-3.5 mr-1 text-blue-400" /> N° Guía de Origen</label>
                      <input type="text" required value={numeroGuia} onChange={(e) => setNumeroGuia(e.target.value)} className="w-full bg-[#050B14] text-white border border-white/10 px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg lg:rounded-xl uppercase outline-none focus:ring-1 focus:ring-blue-500 text-sm lg:text-base" placeholder="Ej: GUI-00123" />
                    </div>
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5 lg:mb-2 flex items-center"><Scale className="w-3.5 h-3.5 mr-1 text-amber-500" /> Peso en Guía (Kg)</label>
                      <input type="number" required value={pesoGuia} onChange={(e) => setPesoGuia(e.target.value)} className="w-full bg-[#050B14] text-white border border-white/10 px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg lg:rounded-xl outline-none focus:ring-1 focus:ring-amber-500 text-sm lg:text-base" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pt-2">
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 lg:mb-2">Peso Bruto (Kg)</label>
                      <div className="relative">
                        <input type="number" required value={pesoBruto} onChange={(e) => setPesoBruto(e.target.value)} className="w-full bg-[#050B14] border border-blue-500/30 px-4 py-3 lg:px-5 lg:py-4 rounded-xl text-xl lg:text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-blue-500" />
                        <span className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm lg:text-base">KG</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5 lg:mb-2">Tara (Kg)</label>
                      <div className="relative">
                        <input type="number" required value={tara} onChange={(e) => setTara(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 px-4 py-3 lg:px-5 lg:py-4 rounded-xl text-xl lg:text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-blue-500" />
                        <span className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm lg:text-base">KG</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#050B14] border border-amber-500/30 p-4 lg:p-5 rounded-xl lg:rounded-2xl flex flex-col sm:flex-row items-center sm:justify-between mt-4 gap-2 sm:gap-0">
                    <div><p className="text-amber-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs text-center sm:text-left mb-1">Peso Neto Calculado</p></div>
                    <div className="flex items-baseline"><span className="text-3xl lg:text-4xl font-extrabold text-amber-400">{pesoNeto.toLocaleString()}</span><span className="text-xs lg:text-sm text-amber-500/50 font-bold ml-1 lg:ml-2">KG</span></div>
                  </div>

                  <button type="submit" disabled={procesando || pesoNeto <= 0} className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-4 lg:py-5 rounded-xl flex items-center justify-center space-x-2 lg:space-x-3 text-base lg:text-lg shadow-xl hover:from-green-500 hover:to-green-400 transition-all">
                    <span>{procesando ? 'PROCESANDO...' : 'REGISTRAR Y EMITIR TICKET'}</span>
                  </button>
                </form>
              </div>

              {/* VISTA PREVIA TICKET (Ajustada para apilar en móvil) */}
              <div className="w-full xl:w-96 flex flex-col justify-start items-center order-1 xl:order-2">
                <div className="bg-white text-slate-800 w-full max-w-sm xl:max-w-full p-6 shadow-2xl relative font-mono text-xs rounded-xl xl:rounded-none">
                  <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                    <h3 className="font-black text-base">SENAFIM TÁCHIRA</h3>
                    <p className="text-[10px]">Control Romana La Romana</p>
                    {ticketGenerado && (
                      <p className="text-xs font-bold mt-2 bg-slate-200 py-1 rounded">TICKET N° {ticketGenerado.consecutivo_ticket.toString().padStart(4, '0')}</p>
                    )}
                  </div>
                  <div className="space-y-2 border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                    <div className="flex justify-between"><span>FECHA:</span> <span>{fechaActual.toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span>HORA:</span> <span>{fechaActual.toLocaleTimeString()}</span></div>
                    
                    <div className="flex justify-between"><span>PLACA:</span> <span className="font-bold">{nombresCamiones[placa]}</span></div>
                    <div className="flex justify-between"><span>CHOFER:</span> <span className="truncate max-w-[150px]">{nombresChoferes[chofer]}</span></div>
                    
                    <div className="flex justify-between text-[10px] text-blue-800 mt-2"><span>ORIGEN:</span> <span className="text-right max-w-[150px] truncate font-bold">Mina Sector Norte</span></div>
                    <div className="flex justify-between text-[10px] text-amber-800"><span>DESTINO:</span> <span className="text-right max-w-[150px] truncate font-bold">Cementera Táchira</span></div>
                    <div className="flex justify-between text-[10px] mt-2 font-bold"><span>GUÍA ORIGEN:</span> <span>{numeroGuia || '---'}</span></div>
                  </div>
                  <div className="space-y-1 border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                    <div className="flex justify-between"><span>P. BRUTO:</span> <span>{pesoBruto || '0'} KG</span></div>
                    <div className="flex justify-between"><span>TARA:</span> <span>{tara || '0'} KG</span></div>
                    <div className="flex justify-between text-base font-black mt-2 bg-slate-100 p-1 rounded"><span>NETO:</span> <span>{pesoNeto.toLocaleString()} KG</span></div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center mt-4">
                    {ticketGenerado ? (
                      <>
                        <QRCodeCanvas 
                          value={`SENAFIM | TICKET: ${ticketGenerado.consecutivo_ticket} | PLACA: ${nombresCamiones[placa]} | NETO: ${ticketGenerado.peso_neto_kg}KG`} 
                          size={100} 
                          level={"M"} 
                        />
                        <p className="text-[8px] text-center mt-2 font-bold uppercase flex items-center"><QrCode className="w-3 h-3 mr-1" /> Válido para Fiscalización</p>
                      </>
                    ) : (
                      <div className="w-[100px] h-[100px] border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[10px] text-center p-2 rounded">
                        El QR se generará al registrar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* VISTA 2: TABLA DE HISTORIAL               */}
          {/* ========================================= */}
          {vistaActiva === 'historial' && (
            <div className="bg-[#0A162C]/80 border border-white/10 rounded-2xl lg:rounded-[2rem] p-4 lg:p-8 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-t-2xl lg:rounded-t-[2rem]"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
                  <Activity className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-amber-500" /> Operaciones
                </h2>
                <button 
                  onClick={cargarHistorial}
                  className="w-full sm:w-auto justify-center bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors border border-white/10 text-sm flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2" /> Actualizar
                </button>
              </div>

              {cargandoHistorial ? (
                <div className="text-center py-10 text-slate-400 animate-pulse text-sm lg:text-base">Cargando base de datos...</div>
              ) : historial.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm lg:text-base">No hay camiones registrados aún.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/5 pb-2">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#050B14] text-[10px] lg:text-xs uppercase tracking-widest text-slate-400 border-b border-white/10">
                        <th className="p-3 lg:p-4 font-semibold whitespace-nowrap">N° Ticket</th>
                        <th className="p-3 lg:p-4 font-semibold">Hora</th>
                        <th className="p-3 lg:p-4 font-semibold">Placa</th>
                        <th className="p-3 lg:p-4 font-semibold whitespace-nowrap">N° Guía</th>
                        <th className="p-3 lg:p-4 font-semibold">Origen</th>
                        <th className="p-3 lg:p-4 font-semibold">Destino</th>
                        <th className="p-3 lg:p-4 font-semibold text-right text-amber-500 whitespace-nowrap">Peso Neto (Kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {historial.map((pesaje) => (
                        <tr key={pesaje.id_registro} className="hover:bg-white/5 transition-colors text-xs lg:text-sm">
                          <td className="p-3 lg:p-4 font-mono font-bold text-blue-400">#{pesaje.consecutivo_ticket}</td>
                          <td className="p-3 lg:p-4 text-slate-300">{pesaje.hora_registro.substring(0, 5)}</td>
                          <td className="p-3 lg:p-4 font-bold text-white whitespace-nowrap">{pesaje.placa}</td>
                          <td className="p-3 lg:p-4 text-slate-300">{pesaje.numero_guia}</td>
                          <td className="p-3 lg:p-4 text-slate-300 truncate max-w-[120px] lg:max-w-[150px]">{pesaje.mina}</td>
                          <td className="p-3 lg:p-4 text-slate-300 truncate max-w-[120px] lg:max-w-[150px]">{pesaje.comprador}</td>
                          <td className="p-3 lg:p-4 font-mono font-bold text-amber-400 text-right">
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