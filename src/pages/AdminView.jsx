import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminView = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [logistica, setLogistica] = useState(null);
  const [loadingCalc, setLoadingCalc] = useState(false);

  const [calcConfig, setCalcConfig] = useState({
    invitados: 0, clima: 'Templado', horario: 'Noche', horasDuracion: 8,
    formatoMenu: 'Plato Servido', alcohol: false, calientes: false, helados: false
  });

  useEffect(() => {
    
    const cargarSolicitudes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/weddings/solicitudes');
        if (response.ok) {
          const data = await response.json();
          setSolicitudes(data);
        }
      } catch (err) {
        console.error('Error al cargar solicitudes', err);
      }
    };

    const user = localStorage.getItem('usuarioLogueado');
    if (!user) {
      navigate('/login'); 
    } else {
      cargarSolicitudes();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogueado');
    navigate('/login');
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`http://localhost:8080/api/v1/weddings/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: nuevoEstado
      });
      
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  const cargarDatosCalculadora = (solicitud) => {
    setCalcConfig({
      invitados: solicitud.numeroInvitados,
      clima: solicitud.tipoAmbiente === 'Playa/Costa' ? 'Caluroso' : 'Templado',
      horario: 'Noche', 
      horasDuracion: 8,
      formatoMenu: solicitud.tipoMenu,
      alcohol: solicitud.bebidasAlcoholicas || false,
      calientes: solicitud.bebidasCalientes || false,
      helados: solicitud.heladosPostre || false
    });
  };

  const handleCalcChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCalcConfig({ ...calcConfig, [e.target.name]: value });
  };

  const procesarCalculo = async () => {
    setLoadingCalc(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/weddings/calcular-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calcConfig)
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogistica(data);
      }
    } catch (err) {
      console.error('Error en cálculo', err);
    } finally {
      setLoadingCalc(false);
    }
  };

  return (
    <div className="min-h-screen bg-tinto-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-tinto-card p-4 border border-gray-800 rounded-sm">
          <h1 className="text-white font-serif tracking-widest uppercase text-xl">Dashboard Administrativo</h1>
          <button onClick={handleLogout} className="text-sm bg-red-900/50 text-red-400 px-4 py-2 hover:bg-red-800 hover:text-white transition-colors">
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-tinto-card border border-gray-800 rounded-sm shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-[#0a0a0a]">
              <h2 className="text-tinto-accent text-sm font-bold tracking-widest uppercase">Solicitudes en Espera</h2>
              <p className="text-xs text-gray-500 mt-1">Haz clic en "Calcular" para enviar los datos al motor logístico.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase tracking-wider text-gray-500 bg-[#0a0a0a] border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Menú</th>
                    <th className="px-4 py-3 text-center">Inv.</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-center">Stock</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {solicitudes.map((sol) => (
                    <tr key={sol.id} className="hover:bg-gray-900/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{sol.nombresNovios}</td>
                      <td className="px-4 py-3 text-xs">{sol.tipoMenu}</td>
                      <td className="px-4 py-3 text-center text-tinto-accent font-bold">{sol.numeroInvitados}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-sm font-bold uppercase ${
                          sol.estado === 'ACEPTADO' ? 'bg-green-900/50 text-green-400' :
                          sol.estado === 'RECHAZADO' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {sol.estado || 'PENDIENTE'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] px-2 py-1 rounded-sm font-bold uppercase border ${
                          sol.stockConfirmado 
                            ? 'bg-green-900/20 text-green-400 border-green-800/50' 
                            : 'bg-yellow-900/20 text-yellow-500 border-yellow-800/50'
                        }`}>
                          {sol.stockConfirmado ? 'Stock OK' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2 text-right">
                        <button onClick={() => cargarDatosCalculadora(sol)} className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 hover:bg-blue-800 hover:text-white transition-colors">
                          Calcular
                        </button>
                        <button 
                          onClick={() => cambiarEstado(sol.id, 'ACEPTADO')} 
                          disabled={!sol.stockConfirmado}
                          className={`text-xs px-2 py-1 transition-colors ${
                            sol.stockConfirmado 
                              ? 'bg-gray-800 hover:bg-green-700 text-white cursor-pointer' 
                              : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          ✓
                        </button>
                        <button onClick={() => cambiarEstado(sol.id, 'RECHAZADO')} className="text-xs bg-gray-800 px-2 py-1 hover:bg-red-700 text-white transition-colors">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-tinto-card border border-gray-800 rounded-sm shadow-xl p-5 flex flex-col">
            <h2 className="text-tinto-accent text-sm font-bold tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Motor Logístico</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">N° Invitados</label>
                <input type="number" name="invitados" value={calcConfig.invitados} onChange={handleCalcChange} className="w-full bg-[#0a0a0a] border border-gray-700 text-white px-2 py-1 text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Clima</label>
                <select name="clima" value={calcConfig.clima} onChange={handleCalcChange} className="w-full bg-[#0a0a0a] border border-gray-700 text-white px-2 py-1 text-sm">
                  <option>Caluroso</option><option>Templado</option><option>Frío</option>
                </select>
              </div>
            </div>
            <button onClick={procesarCalculo} disabled={loadingCalc} className="w-full bg-tinto-accent text-black font-bold uppercase tracking-widest py-3 rounded-sm mb-6 hover:bg-yellow-600 transition-colors text-sm">
              {loadingCalc ? 'Procesando...' : 'Procesar Variables'}
            </button>
            {logistica && (
              <div className="space-y-4 flex-grow text-sm text-gray-300">
                <div className="bg-[#0a0a0a] p-3 border border-gray-800 rounded-sm">
                  <h3 className="text-xs text-tinto-accent font-bold uppercase mb-2">Staff & Infraestructura</h3>
                  <div className="flex justify-between"><span>Garzones:</span> <span className="font-bold text-white">{logistica.cantidadGarzones}</span></div>
                  <div className="flex justify-between"><span>Mesas / Sillas:</span> <span className="font-bold text-white">{logistica.mesas} / {logistica.sillas}</span></div>
                  <div className="flex justify-between"><span>Piezas Vajilla:</span> <span className="font-bold text-white">{logistica.piezasVajilla}</span></div>
                  <div className="flex justify-between"><span>Furgones de Carga:</span> <span className="font-bold text-white">{logistica.vehiculosCarga}</span></div>
                </div>
                <div className="bg-[#0a0a0a] p-3 border border-gray-800 rounded-sm">
                  <h3 className="text-xs text-tinto-accent font-bold uppercase mb-2">Bar & Estaciones Extra</h3>
                  <div className="flex justify-between"><span>Botellas de Vino:</span> <span className="font-bold text-white">{logistica.botellasVino}</span></div>
                  <div className="flex justify-between"><span>Botellas Destilados:</span> <span className="font-bold text-white">{logistica.botellasDestilados}</span></div>
                  <div className="flex justify-between"><span>Litros Cerveza:</span> <span className="font-bold text-white">{logistica.litrosCerveza} L</span></div>
                  <div className="flex justify-between border-t border-gray-800 mt-2 pt-2"><span>Litros de Café:</span> <span className="font-bold text-white">{logistica.litrosCafe} L</span></div>
                  <div className="flex justify-between"><span>Porciones de Helado:</span> <span className="font-bold text-white">{logistica.porcionesHelado}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;