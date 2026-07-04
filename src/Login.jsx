import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, ShieldCheck, UserCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  
  // Estados de la interfaz
  const [rolSeleccionado, setRolSeleccionado] = useState('Operador');
  const roles = ['Operador', 'Inspector', 'Supervisor'];

  // NUEVO: Estados para capturar las credenciales
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  // NUEVO: Función que conecta con tu backend en el puerto 3000
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Guardamos el token en la memoria del navegador
        localStorage.setItem('token', datos.token);
        
        // Enrutamiento inteligente basado en el rol tras el éxito
        if (rolSeleccionado === 'Inspector') {
          navigate('/inspector');
        } else if (rolSeleccionado === 'Supervisor') {
          navigate('/supervisor');
        } else {
          navigate('/operador'); 
        }
      } else {
        // Zod o el controlador rechazaron el acceso
        alert('Acceso denegado: ' + (datos.error || 'Credenciales inválidas'));
      }
    } catch (error) {
      console.error('Fallo en la comunicación:', error);
      alert('Error crítico: No se pudo contactar con la bóveda (Backend).');
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] font-sans flex items-center justify-center relative overflow-hidden selection:bg-amber-500 selection:text-slate-900">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/assets/mapa-mina-bg.png')] bg-cover bg-center opacity-5 mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-md p-6">
        
        {/* === BOTÓN PARA REGRESAR A LA LANDING PAGE === */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-slate-400 hover:text-amber-400 transition-colors mb-8 text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Volver al portal público
        </button>

        <div className="bg-[#0A162C]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-amber-500"></div>

          <div className="text-center mb-8">
            <img src="/assets/senafim-logo-blanco.png" alt="SENAFIM" className="h-14 mx-auto mb-6 object-contain drop-shadow-lg" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Acceso Restringido</h2>
            <p className="text-slate-400 text-sm mt-2">Sistema de Control La Romana</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                <UserCircle className="w-4 h-4 mr-1" /> Nivel de Acceso
              </label>
              <div className="flex bg-[#050B14] p-1.5 rounded-xl border border-white/10">
                {roles.map((rol) => (
                  <button
                    key={rol}
                    type="button"
                    onClick={() => setRolSeleccionado(rol)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                      rolSeleccionado === rol
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {rol}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Usuario Institucional</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full bg-[#050B14] text-white border border-white/10 pl-12 pr-5 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={`${rolSeleccionado.toLowerCase()}@senafim.com`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050B14] text-white border border-white/10 pl-12 pr-5 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-400 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="mr-2 rounded border-white/10 bg-[#050B14] text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0" />
                Recordar sesión
              </label>
              <a href="#" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">¿Olvidó su clave?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 mt-4 flex items-center justify-center group"
            >
              <ShieldCheck className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Ingresar como {rolSeleccionado}
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-600 text-xs mt-8 font-mono">
          IP Auditada. El acceso no autorizado a este sistema será penalizado.
        </p>
      </div>
    </div>
  );
}