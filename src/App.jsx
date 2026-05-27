import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientView from './pages/ClientView';
import AdminView from './pages/AdminView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientView />} />
        
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

export default App;