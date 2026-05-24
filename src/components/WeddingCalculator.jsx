import React, { useState } from 'react';

const WeddingCalculator = () => {
  const [formData, setFormData] = useState({
    nombresNovios: '',
    emailContacto: '',
    fechaBoda: '',
    numeroInvitados: ''
  });

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/weddings/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor logístico.');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tinto-dark flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Columna Izquierda: Formulario */}
        <div className="bg-tinto-card border border-gray-800 p-10 shadow-2xl rounded-sm">
          <h2 className="font-serif text-3xl mb-2 text-white tracking-wide uppercase">Cotización Nupcial</h2>
          <p className="text-gray-400 text-sm mb-8 font-light">Planifica la logística exacta para el evento.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Nombres de los Novios</label>
              <input 
                type="text" 
                name="nombresNovios"
                value={formData.nombresNovios} 
                onChange={handleChange} 
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors placeholder-gray-600"
                required 
                placeholder="Ej. María y Juan"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Correo de Contacto</label>
              <input 
                type="email" 
                name="emailContacto"
                value={formData.emailContacto} 
                onChange={handleChange} 
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors placeholder-gray-600"
                required 
                placeholder="contacto@correo.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Fecha</label>
                <input 
                  type="date" 
                  name="fechaBoda"
                  value={formData.fechaBoda} 
                  onChange={handleChange} 
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors"
                  style={{colorScheme: 'dark'}}
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Invitados</label>
                <input 
                  type="number" 
                  name="numeroInvitados"
                  value={formData.numeroInvitados} 
                  onChange={handleChange} 
                  min="1"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors placeholder-gray-600"
                  required 
                  placeholder="Ej. 120"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-white text-tinto-dark font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Calcular Logística'}
            </button>
            
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </form>
        </div>

        {/* Columna Derecha: Resultados */}
        <div className="flex flex-col justify-center">
          {resultado ? (
            <div className="border border-gray-800 p-10 bg-tinto-card rounded-sm">
              <h3 className="font-serif text-2xl text-white mb-6 border-b border-gray-800 pb-4">Desglose Operativo</h3>
              <p className="text-sm text-green-500 mb-8">{resultado.mensaje}</p>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Staff de Servicio Requerido</h4>
                  <p className="text-4xl font-serif text-tinto-accent">{resultado.cantidadGarzones} <span className="text-lg text-gray-400 font-sans tracking-wide uppercase">Garzones</span></p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-800">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Proteína Marina</h4>
                    <p className="text-2xl text-white">{resultado.kgProteinaMarina} <span className="text-sm text-gray-400">kg</span></p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Sel. de Quesos</h4>
                    <p className="text-2xl text-white">{resultado.kgQuesos} <span className="text-sm text-gray-400">kg</span></p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Cerveza Premium</h4>
                    <p className="text-2xl text-white">{resultado.litrosCerveza} <span className="text-sm text-gray-400">L</span></p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Aguas y Jugos</h4>
                    <p className="text-2xl text-white">{resultado.litrosAgua} <span className="text-sm text-gray-400">L</span></p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center border border-gray-800 p-10 h-full flex flex-col items-center justify-center bg-tinto-card rounded-sm">
              <span className="text-tinto-accent text-5xl mb-4 font-serif">T</span>
              <p className="font-serif text-gray-500 italic text-lg tracking-wide">La proyección logística se generará aquí.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default WeddingCalculator;