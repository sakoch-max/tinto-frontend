import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientView from './pages/ClientView';
import AdminView from './pages/AdminView';
import LoginView from './pages/LoginView';
import CoordinatorView from './pages/CoordinatorView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientView />} />
        <Route path="/coordinador" element={<CoordinatorView />} />
        <Route path="/login" element={<LoginView />} /> 
        
        <Route path="/admin" element={<AdminView />} />
        <Route path="/coordinator" element={<CoordinatorView />} />
      </Routes>
    </Router>
  );
}

export default App;