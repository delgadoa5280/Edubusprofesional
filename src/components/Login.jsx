import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const correoValido = email.endsWith('@uanl.edu.mx');
    const contrasenaCorrecta = password === '1234';
    if (correoValido && contrasenaCorrecta) {
      onLogin();
      navigate('/dashboard');
    } else {
      setError('Correo institucional UANL o contraseña incorrectos');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-md w-full max-w-sm border border-green-300">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6" style={{ fontFamily: "'Bungee', sans-serif" }}>
          EduBus Smart
        </h1>
        <input type="email" placeholder="Correo UANL" className="w-full p-2 border border-green-300 rounded mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-2 border border-green-300 rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200">Iniciar sesión</button>
      </form>
    </div>
  );
}