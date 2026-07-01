import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const TabButton = ({ name, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(name)}
    className={`px-3 py-2 text-[10px] font-bold uppercase transition-all ${
      activeTab === name 
        ? 'text-tinto-accent border-b-2 border-tinto-accent' 
        : 'text-gray-600 hover:text-white'
    }`}
  >
    {name}
  </button>
);

const CoordinatorView = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [activeTab, setActiveTab] = useState('Personal');


  const THRESHOLDS = {
    garzones: 5,
    carneKg: 40,
    platos: 100
  };


  const isLow = (key, value) => {
    return THRESHOLDS[key] !== undefined && value < THRESHOLDS[key];
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
       
        const resSolicitudes = await fetch('http://localhost:8080/api/v1/weddings/solicitudes');
        if (resSolicitudes.ok) setSolicitudes(await resSolicitudes.json());

   
        const resInv = await fetch('http://localhost:8080/api/v1/inventory');
        if (resInv.ok) setInventory(await resInv.json());
      } catch (err) { 
        console.error('Error al cargar datos:', err); 
      }
    };

    const user = localStorage.getItem('usuarioLogueado');
    if (!user) {
      navigate('/login');
    } else {
      cargarDatos();
    }
  }, [navigate]);

  const confirmarStock = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/v1/weddings/${id}/confirmar-stock`, { method: 'PUT' });
      window.location.reload(); 
    } catch (err) { 
      console.error('Error al confirmar stock:', err); 
    }
  };

  const exportarReporteCSV = () => {
    const headers = ["Evento", "Invitados", "Estado"];
    
    const rows = solicitudes.map(s => [
      `"${s.nombresNovios}"`, 
      s.numeroInvitados, 
      s.stockConfirmado ? 'VALIDADO' : 'PENDIENTE'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_logistica_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 
  const eventosOrdenados = [...solicitudes].sort((a, b) => new Date(a.fechaBoda) - new Date(b.fechaBoda));

  return (
    <div className="min-h-screen bg-tinto-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Encabezado Principal */}
        <div className="bg-tinto-card p-6 border border-gray-800 rounded-sm">
          <h1 className="text-white font-serif tracking-widest uppercase text-2xl">Panel de Coordinación Logística</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PANEL IZQUIERDO: Gestión de Solicitudes */}
          <div className="lg:col-span-2 bg-tinto-card border border-gray-800 rounded-sm shadow-xl overflow-hidden">
            {/* Cabecera con título alineado a la izquierda y Botón de Exportación a la derecha */}
            <div className="p-4 border-b border-gray-800 bg-[#0a0a0a] flex justify-between items-center">
              <h2 className="text-tinto-accent text-sm font-bold tracking-widest uppercase">Validación de Disponibilidad</h2>
              <button 
                onClick={exportarReporteCSV}
                className="bg-gray-800 hover:bg-gray-700 text-white text-[10px] uppercase px-3 py-1 rounded transition-colors font-bold tracking-wider"
              >
                Exportar CSV
              </button>
            </div>

            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-[#0a0a0a] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3 text-center">Inv.</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id} className="hover:bg-gray-900/40 border-b border-gray-900/50">
                    <td className="px-4 py-3 text-white font-medium">{sol.nombresNovios}</td>
                    <td className="px-4 py-3 text-center text-tinto-accent font-bold">{sol.numeroInvitados}</td>
                    <td className="px-4 py-3">
                      <span className={sol.stockConfirmado ? "text-green-500 font-semibold" : "text-yellow-600"}>
                        {sol.stockConfirmado ? 'VALIDADO' : 'PENDIENTE'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!sol.stockConfirmado && (
                        <button 
                          onClick={() => confirmarStock(sol.id)} 
                          className="bg-yellow-900/50 text-yellow-500 px-3 py-1 text-[10px] uppercase font-bold hover:bg-yellow-800 transition-colors"
                        >
                          Dar Luz Verde
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         
          <div className="lg:col-span-1 bg-tinto-card border border-gray-800 p-4 min-h-[300px] shadow-xl">
            {/* Navegación de Pestañas */}
            <div className="flex border-b border-gray-800 mb-6 gap-1 overflow-x-auto whitespace-nowrap">
              <TabButton name="Personal" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton name="Infra" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton name="Alimentos" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton name="Timeline" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Contenidos de las Pestañas */}
            {activeTab === 'Timeline' ? (
              <div className="space-y-4 animate-fade-in">
                {eventosOrdenados.map((sol) => (
                  <div key={sol.id} className="relative pl-6 border-l border-tinto-accent/30 pb-4">
                    <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-tinto-accent"></div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {new Date(sol.fechaBoda).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-sm text-white font-medium">{sol.nombresNovios}</div>
                    <div className="text-[10px] text-gray-400 uppercase">{sol.numeroInvitados} invitados</div>
                  </div>
                ))}
                {eventosOrdenados.length === 0 && (
                  <p className="text-gray-500 text-center text-xs">No hay eventos programados.</p>
                )}
              </div>
            ) : inventory ? (
              <div className="space-y-4 animate-fade-in text-gray-400 text-sm">
                
                {/* Pestaña Personal */}
                {activeTab === 'Personal' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Garzones:</span> 
                      <b className={isLow('garzones', inventory.garzones) ? 'text-red-500 animate-pulse text-base' : 'text-white'}>
                        {inventory.garzones} {isLow('garzones', inventory.garzones) && '⚠️'}
                      </b>
                    </div>
                    <div className="flex justify-between"><span>Seguridad:</span> <b className="text-white">{inventory.seguridad}</b></div>
                    <div className="flex justify-between"><span>Chefs:</span> <b className="text-white">{inventory.chefs}</b></div>
                    <div className="flex justify-between"><span>Ayudantes:</span> <b className="text-white">{inventory.ayudantes}</b></div>
                  </div>
                )}
                
                {/* Pestaña Infraestructura */}
                {activeTab === 'Infra' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Platos:</span> 
                      <b className={isLow('platos', inventory.platos) ? 'text-red-500 text-base' : 'text-white'}>
                        {inventory.platos} {isLow('platos', inventory.platos) && '⚠️'}
                      </b>
                    </div>
                    <div className="flex justify-between"><span>Copas:</span> <b className="text-white">{inventory.copas}</b></div>
                    <div className="flex justify-between"><span>Cubiertos:</span> <b className="text-white">{inventory.cubiertos}</b></div>
                    <div className="flex justify-between"><span>Mesas:</span> <b className="text-white">{inventory.mesas}</b></div>
                    <div className="flex justify-between"><span>Sillas:</span> <b className="text-white">{inventory.sillas}</b></div>
                  </div>
                )}

                {/* Pestaña Alimentos */}
                {activeTab === 'Alimentos' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Carne:</span> 
                      <b className={isLow('carneKg', inventory.carneKg) ? 'text-red-500 text-base' : 'text-white'}>
                        {inventory.carneKg} kg {isLow('carneKg', inventory.carneKg) && '⚠️'}
                      </b>
                    </div>
                    <div className="flex justify-between"><span>Pollo:</span> <b className="text-white">{inventory.polloKg} kg</b></div>
                    <div className="flex justify-between"><span>Pescado:</span> <b className="text-white">{inventory.pescadoKg} kg</b></div>
                    <div className="flex justify-between"><span>Vegetales:</span> <b className="text-white">{inventory.vegetalesKg} kg</b></div>
                    <div className="flex justify-between"><span>Carbohidratos:</span> <b className="text-white">{inventory.carbohidratosKg} kg</b></div>
                    <div className="flex justify-between"><span>Bebidas:</span> <b className="text-white">{inventory.litrosBebidas} L</b></div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center text-sm">Cargando datos del servidor...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorView;