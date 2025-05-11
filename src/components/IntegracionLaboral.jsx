// src/components/IntegracionLaboral.jsx
import React from 'react';
import useUserData from '../Hooks/chat/useUserData';

export default function IntegracionLaboral() {
  const { userData, loading, error } = useUserData();
  const [perfilSeleccionado, setPerfilSeleccionado] = React.useState(null);

  if (loading) {
    return <div className="text-white p-6">Cargando usuarios…</div>;
  }
  if (error) {
    return <div className="text-red-400 p-6">Error: {error}</div>;
  }

  // Mapea la respuesta de la API al formato que usa el componente
  const perfiles = userData.map((u) => ({
    id: u.id,
    nombre: u.Nombre_usuario,
    puesto: u.Puesto_Aspirado || '—',
    email: u.Email,
    habilidades: u.Habilidades
      ? u.Habilidades.split(',').map((h) => h.trim())
      : [],
    experiencia: u.Experiencia || 'No especificada',
    entrevistas: u.entrevistas ? JSON.parse(u.entrevistas) : []
  }));

  return (
    <div className="text-white p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Integración Laboral</h1>

      {!perfilSeleccionado ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfiles.map((perfil) => (
            <div
              key={perfil.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setPerfilSeleccionado(perfil)}
            >
              {/* Tarjeta resumida */}
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-3">
                  {perfil.nombre.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{perfil.nombre}</h2>
                  <p className="text-blue-400">{perfil.puesto}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{perfil.email}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.105 0-2 .672-2 1.5S10.895 11 12 11s2-.672 2-1.5S13.105 8 12 8zM12 14v7m0 0c3.866 0 7-3.134 7-7h-7m0 0H5c0 3.866 3.134 7 7 7z" />
                  </svg>
                  <span className="italic">{perfil.experiencia}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-300 mb-2">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                  {perfil.habilidades.slice(0, 4).map((habilidad, i) => (
                    <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {habilidad}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <button
            onClick={() => setPerfilSeleccionado(null)}
            className="flex items-center text-blue-400 mb-6 hover:text-blue-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la lista de perfiles
          </button>

          {/* Encabezado del perfil */}
          <div className="flex flex-col md:flex-row md:items-center mb-8">
            <div className="bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mr-6 mb-4 md:mb-0">
              {perfilSeleccionado.nombre.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{perfilSeleccionado.nombre}</h2>
              <p className="text-xl text-blue-400 mb-2">{perfilSeleccionado.puesto}</p>
              <p className="italic text-gray-300 mb-2">{perfilSeleccionado.experiencia}</p>
              <div className="flex flex-wrap gap-4 text-gray-300">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{perfilSeleccionado.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de entrevistas */}
          <div className="bg-gray-700 rounded-lg p-5 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Entrevistas Finalizadas
            </h3>
            {perfilSeleccionado.entrevistas?.length > 0 ? (
              perfilSeleccionado.entrevistas.map((entrevista, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tipo de Entrevista:</span>
                    <span>{entrevista.Tipo_Entrevista}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Fecha:</span>
                    <span>{entrevista.Fecha_Entrevista}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Puntuación:</span>
                    <span className="bg-blue-500 px-2 py-1 rounded text-sm">{entrevista.Puntaje_Total}/100</span>
                  </div>
                  {entrevista.Feedback && (
                    <div>
                      <p className="font-medium mt-2">Feedback:</p>
                      <p className="text-gray-400 text-sm">{entrevista.Feedback}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No hay entrevistas finalizadas.</p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-col space-y-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">Descargar CV</button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">Contactar</button>
          </div>
        </div>
      )}
    </div>
  );
}
