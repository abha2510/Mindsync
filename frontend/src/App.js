import { Routes, Route } from 'react-router-dom'; 
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
      </Routes>
    </div>
  );
}

export default App;
