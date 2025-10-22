import React, { useMemo, useState } from 'react';
import { useLogin } from '../Hooks/Login/useLogin';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding, FaTimes } from 'react-icons/fa';

export default function Login() {
  const {
    isLogin,
    name, setName,
    email, setEmail,
    password, setPassword,
    isEmployer, setIsEmployer,
    error, success,
    handleToggle, handleSubmit,
    showModal, setShowModal,
    extraData, handleExtraChange, handleExtraSubmit
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => {
    if (isLogin) return email.trim() && password.trim();
    return name.trim() && email.trim() && password.trim();
  }, [isLogin, name, email, password]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Tabs */}
        <div className="flex rounded-t-2xl overflow-hidden shadow-sm">
          <button
            onClick={handleToggle}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
              isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
            aria-pressed={isLogin}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={handleToggle}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
              !isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
            aria-pressed={!isLogin}
          >
            Registrarse
          </button>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-b-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white text-center">
            {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h2>
          <p className="text-white/60 text-center mt-1 text-sm">
            {isLogin ? 'Ingresa tus credenciales para continuar.' : 'Completa la información para registrarte.'}
          </p>

          {/* Alertas */}
          {error && (
            <div className="mt-4 text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
              {success}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-white/80 mb-1 text-sm">Nombre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><FaUser /></span>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-white/80 mb-1 text-sm">Correo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><FaEnvelope /></span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white/80 mb-1 text-sm">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><FaLock /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="text-white/70 text-sm">Aspirante</span>
                <button
                  type="button"
                  onClick={() => setIsEmployer(!isEmployer)}
                  className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors focus:outline-none border ${
                    isEmployer ? 'bg-blue-600 border-blue-500' : 'bg-white/10 border-white/20'
                  }`}
                  aria-pressed={isEmployer}
                  aria-label="Cambiar a Empleador"
                >
                  <span
                    className={`transform transition-transform ease-in-out duration-200 inline-flex items-center justify-center w-6 h-6 bg-white rounded-full shadow ${
                      isEmployer ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  >
                    {isEmployer ? <FaBuilding className="text-blue-600" /> : <FaUser className="text-gray-500" />}
                  </span>
                </button>
                <span className="text-white/70 text-sm">Empleador</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-2.5 text-white font-semibold rounded-xl transition border ${
                canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 border-blue-500'
                  : 'bg-white/10 border-white/20 opacity-60 cursor-not-allowed'
              }`}
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>

            {/* CTA secundaria */}
            <div className="text-center text-sm text-white/60">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                type="button"
                onClick={handleToggle}
                className="text-blue-300 hover:text-blue-200 underline"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal extra data */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-900 text-white border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {isEmployer ? 'Información de Empresa' : 'Información de Aspirante'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
            </div>

            {isEmployer ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80 mb-1">Empresa</label>
                  <input
                    name="Empresa"
                    value={extraData.Empresa}
                    onChange={handleExtraChange}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80 mb-1">Experiencia</label>
                  <input
                    name="Experiencia"
                    value={extraData.Experiencia}
                    onChange={handleExtraChange}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40"
                    placeholder="Años o nivel (Junior/Semi/ Senior)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-1">Puesto Aspirado</label>
                  <input
                    name="Puesto_Aspirado"
                    value={extraData.Puesto_Aspirado}
                    onChange={handleExtraChange}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40"
                    placeholder="Ej. Desarrollador Frontend"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-1">Habilidades</label>
                  <input
                    name="Habilidades"
                    value={extraData.Habilidades}
                    onChange={handleExtraChange}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40"
                    placeholder="React, SQL, Docker..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-1">Ubicación</label>
                  <input
                    name="Ubicacion"
                    value={extraData.Ubicacion}
                    onChange={handleExtraChange}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40"
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleExtraSubmit}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 border border-blue-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}