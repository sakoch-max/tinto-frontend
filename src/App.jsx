import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientView from './pages/ClientView';
import AdminView from './pages/AdminView';
import LoginView from './pages/LoginView'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientView />} />
        
        {/* <-- 2. Aquí registramos la ruta que faltaba --> */}
        <Route path="/login" element={<LoginView />} /> 
        
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

export default App;