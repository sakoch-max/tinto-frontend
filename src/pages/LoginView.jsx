import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [credenciales, setCredenciales] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales),
      });

      if (!response.ok) throw new Error('Credenciales incorrectas');

      const data = await response.json();
      
      
      localStorage.setItem('usuarioLogueado', JSON.stringify(data));

      
      if (data.rol === 'ADMIN') {
        navigate('/admin');
      } else if (data.rol === 'COORDINADOR') {
        navigate('/coordinador');
      } else {
        
        localStorage.removeItem('usuarioLogueado'); 
        throw new Error('Acceso denegado: El personal de cocina u operaciones debe utilizar la aplicación móvil.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tinto-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-tinto-card border border-gray-800 p-10 shadow-2xl rounded-sm">
        <h2 className="font-serif text-3xl mb-2 text-white tracking-wide uppercase text-center">Acceso Staff</h2>
        <p className="text-gray-400 text-sm mb-8 font-light text-center">Portal Administrativo - Tinto Banquetería</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Usuario</label>
            <input 
              type="text" 
              name="username" 
              value={credenciales.username} 
              onChange={handleChange} 
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              value={credenciales.password} 
              onChange={handleChange} 
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm px-4 py-3 text-gray-100 focus:outline-none focus:border-tinto-accent transition-colors" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-8 bg-tinto-accent text-[#0a0a0a] font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
          
          {error && (
            <div className="bg-red-900/30 border border-red-800 p-3 rounded-sm mt-4">
              <p className="text-red-400 text-xs text-center font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginView;