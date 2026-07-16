import React, { useState, useEffect, useRef } from 'react';

// 1. AQUI IMPORTAMOS EL ENRUTADOR (useNavigate)
import { useNavigate } from 'react-router-dom'; 

import { ChevronRight, ChevronLeft, Users, Building, Pickaxe, Briefcase, X, UploadCloud, ArrowRight, ShieldCheck, Activity, Bot, Mail, MapPin, Clock } from 'lucide-react';

export default function Landing() {
  // 2. AQUI INICIALIZAMOS EL ENRUTADOR
  const navigate = useNavigate(); 
  
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Estados para Modales y Formularios
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState("");
  const [idVacanteSeleccionada, setIdVacanteSeleccionada] = useState(1);
  const [emailUsuario, setEmailUsuario] = useState("");

  // ==================================================
  // ESTADOS PARA EL FORMULARIO REAL AL BACKEND
  // ==================================================
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [cedulaPrefijo, setCedulaPrefijo] = useState("V");
  const [cedulaNumero, setCedulaNumero] = useState("");
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ==================================================
  // 3. AQUI DECLARAMOS LOS ESTADOS DE SENAFINA
  // ==================================================
  const [isSenafinaOpen, setIsSenafinaOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hola mi nombre es Senafina y estoy aquí para ayudarte a comprender un poco más acerca del Carbón 💎' }
  ]);
  const chatContainerRef = useRef(null);

  // ==================================================
  // 4. AQUI ESTÁ LA LÓGICA DE SENAFINA (Sus respuestas)
  // ==================================================
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isSenafinaOpen]);

  const handleQuestionClick = (question) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: question }]);
    let answer = "";
    if (question === "¿Qué es el carbón mineral?") {
      answer = "El carbón mineral es una roca sedimentaria combustible, muy rica en carbono. En nuestra región, destaca por su alto poder calorífico, lo que lo hace excelente para la generación de energía.";
    } else if (question === "¿Cómo es el proceso de extracción?") {
      answer = "En la poligonal 'La Gran Ubatera', el carbón se extrae cuidando estrictos estándares. Luego, es transportado en camiones hacia La Romana, donde nuestro sistema automatizado realiza el pesaje exacto (peso bruto, tara y neto) para asegurar la fiscalización transparente.";
    } else if (question === "Importancia para la industria") {
      answer = "¡Es un recurso estratégico! Impulsa hornos industriales, cementeras y plantas termoeléctricas. Su control riguroso garantiza no solo el sustento energético, sino también ingresos clave para el desarrollo del municipio Lobatera y el estado Táchira.";
    }
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: answer }]);
    }, 600);
  };

  // === LÓGICA DEL CARRUSEL ===
  const imagenesCarrusel = [
    '/assets/carrusel-1.jpg',
    '/assets/carrusel-2.jpg',
    '/assets/carrusel-3.jpg'
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siguienteImagen = () => setCurrentSlide((prev) => (prev + 1) % imagenesCarrusel.length);
  const anteriorImagen = () => setCurrentSlide((prev) => (prev - 1 + imagenesCarrusel.length) % imagenesCarrusel.length);

  // === DATOS DE OFERTAS DE EMPLEO ===
  const ofertasEmpleo = [
    {
      id: 1,
      titulo: "Operador de Báscula Automatizada",
      ubicacion: "La Romana, Lobatera",
      tipo: "Tiempo Completo",
      icono: <Activity className="w-6 h-6 text-blue-400" />
    },
    {
      id: 2,
      titulo: "Ingeniero(a) de Sistemas / IT",
      ubicacion: "San Cristóbal / Remoto",
      tipo: "Híbrido",
      icono: <Briefcase className="w-6 h-6 text-amber-400" />
    },
    {
      id: 3,
      titulo: "Fiscal Inspector de Mina",
      ubicacion: "Poligonal La Gran Ubatera",
      tipo: "Turnos Rotativos",
      icono: <ShieldCheck className="w-6 h-6 text-green-400" />
    }
  ];

  // === MANEJO DEL FORMULARIO CONECTADO AL BACKEND ===
  const abrirFormulario = (tituloPuesto, idPuesto = 1) => {
    setPuestoSeleccionado(tituloPuesto);
    setIdVacanteSeleccionada(idPuesto);
    setIsModalOpen(true);
  };

  const procesarFormulario = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Armamos el paquete de datos exacto que espera Node.js
    const datosFormulario = {
      id_vacante: idVacanteSeleccionada,
      nombre_completo: nombreUsuario,
      cedula: `${cedulaPrefijo}-${cedulaNumero}`,
      telefono: telefonoUsuario,
      correo_contacto: emailUsuario,
      cv_archivo_pdf: "Cargado desde portal web" 
    };

    try {
      // CORRECCIÓN: Apuntando al servidor de producción en Render
      const respuesta = await fetch('https://senafim-api.onrender.com/api/vacantes/postular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario)
      });

      if (respuesta.ok) {
        setIsModalOpen(false); 
        
        // MENSAJE DE ÉXITO REAL
        alert("¡Postulación enviada con éxito! Revisa tu bandeja de entrada o la carpeta de Spam para ver la confirmación.");
        
        // Limpiamos los campos para una próxima vez
        setNombreUsuario(""); 
        setCedulaNumero(""); 
        setTelefonoUsuario(""); 
        setEmailUsuario("");
      } else {
        const errorData = await respuesta.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      console.error("Error conectando al servidor:", error);
      alert("Error de conexión con el servidor SENAFIM.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] font-sans text-slate-300 selection:bg-amber-500 selection:text-slate-900 relative">
      
      {/* ================= NAVBAR ================= */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#050B14]/80 backdrop-blur-md py-3 shadow-2xl border-b border-white/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-12 object-contain transition-transform duration-500 group-hover:scale-105" />
          </div>
          <nav className="hidden lg:flex space-x-8 text-sm font-semibold tracking-wide">
            <a href="#quienes-somos" className="text-slate-300 hover:text-amber-400 transition-colors">Nosotros</a>
            <a href="#empresa" className="text-slate-300 hover:text-amber-400 transition-colors">SENAFIM</a>
            <a href="#carbon" className="text-slate-300 hover:text-amber-400 transition-colors">El Recurso</a>
            <a href="#postulaciones" className="text-slate-300 hover:text-amber-400 transition-colors">Talento</a>
          </nav>
          
          {/* 5. AQUI CONECTAMOS EL ENRUTADOR AL BOTON DE ACCESO */}
          <button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-[#050B14] font-bold py-2.5 px-7 rounded-full transition-all transform hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 flex items-center text-sm"
          >
            Acceso al Sistema <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/assets/mapa-mina-bg.png')] bg-cover bg-center opacity-5 mix-blend-screen"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-medium tracking-wider uppercase text-amber-400">Lobatera, Estado Táchira</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Automatizado</span> de Producción
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-xl font-light leading-relaxed">
              Plataforma de alta precisión para la fiscalización y registro de pesaje en La Romana, poligonal "La Gran Ubatera".
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#quienes-somos" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:-translate-y-1 text-center">
                Explorar Proyecto
              </a>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <img src="/assets/carbon-derecha.png" alt="Carbón Premium" className="relative z-10 w-full max-w-lg mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-[bounce_6s_ease-in-out_infinite]" style={{ filter: 'brightness(1.1) contrast(1.2)' }} />
          </div>
        </div>
      </section>

      {/* ================= QUIÉNES SOMOS ================= */}
      <section id="quienes-somos" className="py-24 relative z-10 bg-[#081221] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 lg:pr-10 z-20">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <Users className="w-10 h-10 text-blue-400 mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Ingeniería <br/><span className="text-amber-400">Con Propósito</span></h2>
                <p className="text-slate-400 leading-relaxed mb-6">Somos un equipo especializado en el desarrollo de arquitecturas de software para el sector minero. Diseñamos soluciones tecnológicas que erradican la inexactitud y optimizan el rendimiento logístico.</p>
                <p className="text-slate-400 leading-relaxed">Nuestra misión es blindar la transparencia del pesaje mediante herramientas digitales de vanguardia, impulsando el crecimiento sustentable.</p>
              </div>
            </div>
            <div className="lg:col-span-7 lg:-ml-12 z-10">
              <div className="relative h-[400px] md:h-[500px] w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                <img src={imagenesCarrusel[currentSlide]} alt="Instalaciones" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-black/20 to-transparent"></div>
                <button onClick={anteriorImagen} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={siguienteImagen} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"><ChevronRight className="w-6 h-6" /></button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                  {imagenesCarrusel.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`transition-all duration-500 rounded-full h-1.5 ${currentSlide === index ? 'w-8 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'w-2 bg-white/40 hover:bg-white/80'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EMPRESA Y RECURSO ================= */}
      <section id="empresa" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16">
          <div className="group relative bg-[#0A162C] rounded-[2rem] p-10 border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
            <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20"><ShieldCheck className="w-8 h-8 text-blue-400" /></div>
            <h2 className="text-3xl font-bold text-white mb-4">El Respaldo Institucional</h2>
            <h3 className="text-amber-500 font-semibold mb-6">SENAFIM</h3>
            <p className="text-slate-400 leading-relaxed">El Servicio Nacional de Fiscalización e Inspección Minera es el pilar de la legalidad operativa. Este sistema ha sido diseñado bajo sus estrictas normativas para garantizar la auditoría total de cada tonelada extraída.</p>
          </div>
          <div id="carbon" className="group relative bg-[#0A162C] rounded-[2rem] p-10 border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 lg:mt-16">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-amber-900/30 rounded-2xl flex items-center justify-center border border-amber-500/20"><Activity className="w-8 h-8 text-amber-400" /></div>
              <img src="/assets/carbon-derecha.png" alt="Mini carbon" className="w-20 opacity-50 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Energía Estratégica</h2>
            <h3 className="text-amber-500 font-semibold mb-6">Carbón Mineral de Alta Pureza</h3>
            <p className="text-slate-400 leading-relaxed">La poligonal "La Gran Ubatera" produce un recurso con un alto poder calorífico. Su extracción controlada es vital para la matriz industrial, requiriendo un pesaje exacto que no deje margen al error humano.</p>
          </div>
        </div>
      </section>

      {/* ================= POSTULACIONES ================= */}
      <section id="postulaciones" className="py-24 relative z-10 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0A162C] to-[#050B14] rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/mapa-mina-bg.png')] opacity-5 mix-blend-overlay"></div>
          
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Súmate a la Innovación</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto font-light">
              Vacantes activas para profesionales comprometidos con el desarrollo tecnológico y minero en el Estado Táchira.
            </p>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-6 mb-10">
            {ofertasEmpleo.map((oferta) => (
              <div key={oferta.id} className="bg-white/5 border border-white/10 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/10 transition-colors">
                    {oferta.icono}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{oferta.titulo}</h3>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-slate-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> {oferta.ubicacion}</p>
                    <p className="text-sm text-slate-400 flex items-center"><Clock className="w-4 h-4 mr-2" /> {oferta.tipo}</p>
                  </div>
                </div>
                <button 
                  onClick={() => abrirFormulario(oferta.titulo, oferta.id)}
                  className="w-full bg-[#12223D] hover:bg-amber-500 text-blue-200 hover:text-[#050B14] font-bold py-3 px-4 rounded-xl transition-colors border border-white/5 group-hover:border-transparent flex justify-center items-center"
                >
                  Postularse <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="relative z-10 text-center border-t border-white/10 pt-8 mt-8">
            <p className="text-sm text-slate-500">¿No encuentras tu perfil? <button onClick={() => abrirFormulario("Candidato(a) General", 1)} className="text-amber-500 hover:underline">Envía tu CV a nuestra base general.</button></p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#02050A] border-t border-white/5 py-10 text-center relative z-10">
        <img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-8 mx-auto mb-6 opacity-30 grayscale" />
        <p className="text-slate-500 text-sm">© 2026 Sistema de Control de Producción Minera - La Romana.</p>
        <p className="text-slate-600 text-xs mt-2 font-mono">Desarrollado para el Estado Táchira - Ingeniería de Sistemas</p>
      </footer>

      {/* ================= MODAL DEL FORMULARIO ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#050B14]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A162C] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-amber-500"></div>
            
            <div className="px-8 py-6 flex justify-between items-center border-b border-white/5">
              <div>
                <h3 className="font-bold text-xl text-white flex items-center">Postulación</h3>
                <p className="text-sm text-amber-400 mt-1 font-medium">Cargo: {puestoSeleccionado}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <form className="p-8 space-y-5" onSubmit={procesarFormulario}>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  required 
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  className="w-full bg-[#050B14] text-white border border-white/10 px-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  placeholder="Ej. Carlos Mendoza" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cédula</label>
                  <div className="flex shadow-sm rounded-xl overflow-hidden border border-white/10 focus-within:ring-2 focus-within:ring-blue-500">
                    <select 
                      value={cedulaPrefijo}
                      onChange={(e) => setCedulaPrefijo(e.target.value)}
                      className="bg-[#12223D] text-amber-400 font-bold px-3 py-3 outline-none border-r border-white/10 cursor-pointer"
                    >
                      <option value="V">V</option><option value="E">E</option><option value="P">P</option>
                    </select>
                    <input 
                      type="number" 
                      required 
                      value={cedulaNumero}
                      onChange={(e) => setCedulaNumero(e.target.value)}
                      className="w-full bg-[#050B14] text-white px-3 py-3 outline-none" 
                      placeholder="12345678" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Celular</label>
                  <input 
                    type="tel" 
                    required 
                    value={telefonoUsuario}
                    onChange={(e) => setTelefonoUsuario(e.target.value)}
                    className="w-full bg-[#050B14] text-white border border-white/10 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="0414-0000000" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico (Requerido)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    required 
                    value={emailUsuario}
                    onChange={(e) => setEmailUsuario(e.target.value)}
                    className="w-full bg-[#050B14] text-white border border-white/10 pl-12 pr-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="tu-correo@ejemplo.com" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Curriculum Vitae (PDF)</label>
                <div className="border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-white/5 rounded-2xl p-6 text-center transition-all relative cursor-pointer group">
                  <input type="file" accept=".pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-2 group-hover:text-amber-400 transition-colors group-hover:scale-110 duration-300" />
                  <p className="text-sm text-slate-300 font-medium">Haz clic para cargar</p>
                  <p className="text-xs text-amber-500/80 mt-1 font-mono">Max. 2 Páginas - .PDF</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 disabled:bg-blue-800 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando Datos y Notificación...' : 'Enviar Postulación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 6. AQUI ESTÁ SENAFINA (Visualización del Chat)     */}
      {/* ================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isSenafinaOpen && (
          <div className="bg-[#0A162C]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[340px] mb-6 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center p-1 overflow-hidden">
                  <img src="/assets/senafina-avatar.png" alt="Senafina" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
                  <Bot className="w-6 h-6 text-white absolute -z-10" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight">SENAFINA</h3>
                  <span className="text-blue-100 text-[10px] flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span> En línea</span>
                </div>
              </div>
              <button onClick={() => setIsSenafinaOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div ref={chatContainerRef} className="p-5 space-y-4 h-80 overflow-y-auto bg-[#050B14]/80 scroll-smooth custom-scrollbar">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex space-x-3 items-end ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center overflow-hidden ${msg.sender === 'user' ? 'bg-amber-500/20 border-amber-500/50' : 'bg-blue-900/50 border-blue-500/30'}`}>
                    {msg.sender === 'user' ? (<Users className="w-4 h-4 text-amber-400" />) : (<><img src="/assets/senafina-avatar.png" alt="Senafina" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} /><Bot className="w-4 h-4 text-amber-400 absolute -z-10" /></>)}
                  </div>
                  <div className={`${msg.sender === 'user' ? 'bg-amber-500/10 border-amber-500/20 rounded-br-none text-amber-100' : 'bg-white/10 border-white/5 rounded-bl-none text-slate-200'} border rounded-2xl p-4 text-sm shadow-sm relative max-w-[80%]`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0A162C] p-4 border-t border-white/5 space-y-2">
              <p className="text-xs text-slate-500 mb-2">Haz clic para preguntar:</p>
              <button onClick={() => handleQuestionClick("¿Qué es el carbón mineral?")} className="w-full text-left text-sm bg-white/5 hover:bg-blue-900/40 border border-white/5 hover:border-blue-500/30 text-blue-300 py-2.5 px-4 rounded-xl transition-all hover:translate-x-1 flex justify-between items-center group"><span className="truncate pr-2">¿Qué es el carbón mineral?</span><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" /></button>
              <button onClick={() => handleQuestionClick("¿Cómo es el proceso de extracción?")} className="w-full text-left text-sm bg-white/5 hover:bg-blue-900/40 border border-white/5 hover:border-blue-500/30 text-blue-300 py-2.5 px-4 rounded-xl transition-all hover:translate-x-1 flex justify-between items-center group"><span className="truncate pr-2">¿Cómo es el proceso?</span><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" /></button>
              <button onClick={() => handleQuestionClick("Importancia para la industria")} className="w-full text-left text-sm bg-white/5 hover:bg-blue-900/40 border border-white/5 hover:border-blue-500/30 text-blue-300 py-2.5 px-4 rounded-xl transition-all hover:translate-x-1 flex justify-between items-center group"><span className="truncate pr-2">Importancia para la industria</span><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" /></button>
            </div>
          </div>
        )}

        {/* Botón Flotante (Trigger) */}
        <button onClick={() => setIsSenafinaOpen(!isSenafinaOpen)} className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 p-1 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-transform hover:scale-110 hover:-translate-y-1 flex items-center justify-center relative group z-50">
          
          {/* Contenedor circular para la foto de Senafina */}
          <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center relative bg-[#050B14]/10">
            <img 
              src="/assets/senafina-avatar.png" 
              alt="Senafina" 
              className="w-full h-full object-cover relative z-10" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            {/* Ícono de respaldo */}
            <Bot className="w-8 h-8 text-[#050B14] absolute z-0" />
          </div>

          {/* Puntito indicador de notificación */}
          {!isSenafinaOpen && (
            <span className="absolute top-0 right-0 flex h-4 w-4 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#050B14]"></span>
            </span>
          )}
        </button>
      </div>

    </div>
  );
}