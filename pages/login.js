// pages/login.js
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      router.push('/dashboard'); // Redirigir a dashboard
    } else {
      const errorData = await response.json();
      setError(errorData.message); // Mostrar error
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar Sesión</title>
        <meta name="description" content="Inicia sesión en Product Price App." />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-800">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-8 py-6 max-w-sm w-full"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Iniciar Sesión
          </button>
          <p className="mt-4 text-center text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
