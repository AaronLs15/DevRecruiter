import React from 'react';
import { useLogin } from '../Hooks/Login/useLogin';

export default function Login() {
  const {
    isLogin,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isEmployer,
    setIsEmployer,
    error,
    success,
    handleToggle,
    handleSubmit
  } = useLogin();

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-center mb-6">
        <button
          onClick={handleToggle}
          className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none ${
            isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={handleToggle}
          className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none ml-2 ${
            !isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Iniciar Sesión' : 'Registrar Usuario'}
        </h2>

        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
        {success && <p className="mb-4 text-green-600 text-center">{success}</p>}

        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-1">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">Correo</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!isLogin && (
          <div className="flex items-center justify-center mb-6">
            <span className="mr-2 text-gray-700">Aspirante</span>
            <button
              type="button"
              onClick={() => setIsEmployer(!isEmployer)}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                isEmployer ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`transform transition-transform ease-in-out duration-200 inline-block w-5 h-5 bg-white rounded-full ${
                  isEmployer ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-2 text-gray-700">Empleador</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-b-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  );
}