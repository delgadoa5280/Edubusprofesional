import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useState } from 'react';

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <Routes>
      <Route path="/" element={<Login onLogin={() => setIsLogged(true)} />} />
      <Route path="/dashboard" element={isLogged ? <Dashboard /> : <Navigate to="/" />} />
    </Routes>
  );
}