import { useState } from 'react';

const ClientView = () => {
  const [formData, setFormData] = useState({
    nombresNovios: '',
    emailContacto: '',
    fechaBoda: '',
    numeroInvitados: '',
    tipoMenu: 'Plato Servido',
    tipoAmbiente: 'Interior Elegante',
    bebidasAlcoholicas: false,
    bebidasCalientes: false,
    heladosPostre: false
  });

  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensajeExito(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/weddings/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al enviar la solicitud.');

      const data = await response.json();
      setMensajeExito(data.mensaje);
      
      
      setFormData({ 
        nombresNovios: '', emailContacto: '', fechaBoda: '', numeroInvitados: '', 
        tipoMenu: 'Plato Servido', tipoAmbiente: 'Interior Elegante', 
        bebidasAlcoholicas: false, bebidasCalientes: false, heladosPostre: false 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tinto-dark flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-tinto-card border border-gray-800 p-10 shadow-2xl rounded-sm">
        <h2 className="font-serif text-3xl mb-2 text-white tracking-wide uppercase text-center">Tinto Banquetería</h2>
        <p className="text-gray-400 text-sm mb-8 font-light text-center">Configurador de Eventos</p>
        
        {mensajeExito ? (
          <div className="bg-green-900/20 border border-green-800 p-6 rounded-sm text-center">
            <h3 className="text-green-500 font-serif text-xl mb-2">¡Recibido!</h3>
            <p className="text-gray-300">{mensajeExito}</p>
            <button onClick={() => setMensajeExito(null)} className="mt-6 text-sm text-tinto-accent uppercase tracking-widest hover:text-white transition-colors">
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECCIÓN 1: Datos Base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-800 pb-6">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Nombres de los Novios</label>
                <input type="text" name="nombresNovios" value={formData.nombresNovios} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent" required placeholder="Ej. María y Juan" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Correo de Contacto</label>
                <input type="email" name="emailContacto" value={formData.emailContacto} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent" required placeholder="contacto@correo.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Fecha del Evento</label>
                <input type="date" name="fechaBoda" value={formData.fechaBoda} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent" style={{colorScheme: 'dark'}} required />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">N° Invitados Est.</label>
                <input type="number" name="numeroInvitados" value={formData.numeroInvitados} onChange={handleChange} min="1" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent" required placeholder="Ej. 120" />
              </div>
            </div>

            {/* SECCIÓN 2: Opciones de Formato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Formato de Menú</label>
                <select name="tipoMenu" value={formData.tipoMenu} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent">
                  <option value="Plato Servido">Plato Servido (Tradicional)</option>
                  <option value="Buffet">Estilo Buffet</option>
                  <option value="Cóctel Largo">Cóctel Largo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Ambiente del Evento</label>
                <select name="tipoAmbiente" value={formData.tipoAmbiente} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent">
                  <option value="Interior Elegante">Interior Elegante (Salón)</option>
                  <option value="Exterior Rústico">Exterior Rústico (Parcela/Campestre)</option>
                  <option value="Playa/Costa">Playa / Aire Libre</option>
                </select>
              </div>
            </div>

            {/* SECCIÓN 3: Checkboxes de Adicionales */}
            <div className="bg-[#0a0a0a] p-5 border border-gray-800 rounded-sm space-y-4">
              <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase border-b border-gray-800 pb-2">Servicios Adicionales (Opcional)</h3>
              
              <label className="flex items-center space-x-3 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" name="bebidasAlcoholicas" checked={formData.bebidasAlcoholicas} onChange={handleChange} className="accent-tinto-accent h-4 w-4" />
                <span>Incluir Barra de Alcohol (Destilados premium, Vinos y Espumantes)</span>
              </label>
              
              <label className="flex items-center space-x-3 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" name="bebidasCalientes" checked={formData.bebidasCalientes} onChange={handleChange} className="accent-tinto-accent h-4 w-4" />
                <span>Estación de Bebestibles Calientes (Café de grano, Té e Infusiones)</span>
              </label>
              
              <label className="flex items-center space-x-3 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" name="heladosPostre" checked={formData.heladosPostre} onChange={handleChange} className="accent-tinto-accent h-4 w-4" />
                <span>Estación de Helados Artesanales y Postres Fríos</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-8 bg-tinto-accent text-[#0a0a0a] font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-yellow-600 transition-colors disabled:opacity-50 shadow-lg">
              {loading ? 'Procesando...' : 'Solicitar Cotización'}
            </button>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ClientView;