import React, { useState, useEffect } from 'react';

const AdminView = () => {
  const [adminData, setAdminData] = useState({
    invitados: '',
    clima: 'Templado',
    horario: 'Día',
    horasDuracion: 8,
    formatoMenu: 'Plato Servido'
  });

  const [resultado, setResultado] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [loadingTabla, setLoadingTabla] = useState(true);
  const [error, setError] = useState(null);

  
  const cargarSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/weddings/solicitudes');
      if (!response.ok) throw new Error('No se pudo cargar la lista de solicitudes.');
      const data = await response.json();
      setSolicitudes(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingTabla(false);
    }
  };

  
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/weddings/calcular-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...adminData,
            invitados: parseInt(adminData.invitados),
            horasDuracion: parseInt(adminData.horasDuracion)
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con el servidor logístico.');

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tinto-dark p-6 space-y-12 flex flex-col items-center justify-start pt-12">
      
      {/* SECCIÓN 1: Calculadora y Proyección */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel de Configuración (Izquierda) */}
        <div className="lg:col-span-5 bg-tinto-card border border-gray-800 p-8 shadow-2xl rounded-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-white tracking-wide uppercase">Motor Logístico</h2>
            <span className="bg-tinto-accent text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-sm uppercase">Admin</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Cantidad de Invitados</label>
              <input type="number" name="invitados" value={adminData.invitados} onChange={handleChange} min="1" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors" required placeholder="Ej. 150" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Clima Estimado</label>
                <select name="clima" value={adminData.clima} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors">
                  <option value="Frío">Frío</option>
                  <option value="Templado">Templado</option>
                  <option value="Caluroso">Caluroso</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Horario</label>
                <select name="horario" value={adminData.horario} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors">
                  <option value="Día">Día</option>
                  <option value="Noche">Noche</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Formato Menú</label>
                <select name="formatoMenu" value={adminData.formatoMenu} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors">
                  <option value="Plato Servido">Plato Servido</option>
                  <option value="Buffet">Buffet</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Duración (Horas)</label>
                <input type="number" name="horasDuracion" value={adminData.horasDuracion} onChange={handleChange} min="4" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-6 bg-white text-[#0a0a0a] font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-50">
              {loading ? 'Calculando...' : 'Procesar Variables'}
            </button>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </form>
        </div>

        {/* Panel de Resultados (Derecha) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {resultado ? (
            <div className="border border-gray-800 p-10 bg-tinto-card rounded-sm h-full flex flex-col justify-center">
              <h3 className="font-serif text-2xl text-white mb-2 border-b border-gray-800 pb-4">Proyección Operativa</h3>
              <p className="text-xs text-tinto-accent tracking-widest uppercase mb-8">{resultado.mensaje}</p>

              <div className="space-y-8">
                <div className="bg-[#0a0a0a] p-6 border border-gray-800 rounded-sm">
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Requerimiento de Personal</h4>
                  <p className="text-5xl font-serif text-white">{resultado.cantidadGarzones} <span className="text-lg text-gray-400 font-sans tracking-wide uppercase">Garzones</span></p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#0a0a0a] p-6 border border-gray-800 rounded-sm">
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Alimentos (Proteína / Quesos)</h4>
                    <p className="text-3xl text-white font-serif mb-1">{resultado.kgProteinaMarina} <span className="text-sm text-gray-400 font-sans">kg mar y tierra</span></p>
                    <p className="text-xl text-gray-300 font-serif">{resultado.kgQuesos} <span className="text-sm text-gray-500 font-sans">kg selección</span></p>
                  </div>
                  <div className="bg-[#0a0a0a] p-6 border border-gray-800 rounded-sm">
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Líquidos (Alcohol / Hidratación)</h4>
                    <p className="text-3xl text-white font-serif mb-1">{resultado.litrosCerveza} <span className="text-sm text-gray-400 font-sans">L cerveza</span></p>
                    <p className="text-xl text-gray-300 font-serif">{resultado.litrosAgua} <span className="text-sm text-gray-500 font-sans">L agua/jugos</span></p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center border border-gray-800 p-10 h-full flex flex-col items-center justify-center bg-tinto-card rounded-sm">
              <span className="text-gray-600 text-6xl mb-6 font-serif">⚙️</span>
              <p className="font-serif text-gray-500 italic text-lg tracking-wide">Ingrese las variables del evento para generar el desglose logístico.</p>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: Tabla de Solicitudes Recibidas (Abajo) */}
      <div className="w-full max-w-6xl bg-tinto-card border border-gray-800 p-8 shadow-2xl rounded-sm">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <h3 className="font-serif text-xl text-white tracking-wide uppercase">Solicitudes de Clientes en Espera</h3>
          <button onClick={cargarSolicitudes} className="text-xs border border-gray-700 text-gray-400 px-3 py-1 hover:bg-gray-800 hover:text-white transition-colors rounded-sm uppercase tracking-wider">
            🔄 Actualizar Tabla
          </button>
        </div>

        {loadingTabla ? (
          <p className="text-gray-500 text-sm italic text-center py-6">Conectando con Neon Database...</p>
        ) : solicitudes.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center py-6">No hay solicitudes registradas en la base de datos aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-[#0a0a0a] border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Novios</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Fecha Boda</th>
                  <th className="px-6 py-4 text-center">Invitados</th>
                  <th className="px-6 py-4">Menú Pref.</th>
                  <th className="px-6 py-4">Temática</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{solicitud.nombresNovios}</td>
                    <td className="px-6 py-4 text-gray-400">{solicitud.emailContacto}</td>
                    <td className="px-6 py-4">{solicitud.fechaBoda}</td>
                    <td className="px-6 py-4 text-center text-tinto-accent font-mono font-bold">{solicitud.numeroInvitados}</td>
                    <td className="px-6 py-4"><span className="bg-gray-800/60 text-gray-300 text-xs px-2 py-1 rounded-sm">{solicitud.tipoMenu}</span></td>
                    <td className="px-6 py-4 text-gray-400 italic">{solicitud.tematicaBoda || 'No especificada'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminView;