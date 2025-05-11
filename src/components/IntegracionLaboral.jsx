// src/components/IntegracionLaboral.jsx
import React from 'react';

// Datos de ejemplo para perfiles (deberías reemplazarlos con datos reales)
const perfiles = [
  {
    id: 1,
    nombre: "Ana López",
    puesto: "Desarrolladora Frontend Senior",
    email: "ana.lopez@example.com",
    telefono: "+52 33 1234 5678",
    ubicacion: "Guadalajara, Jalisco",
    habilidades: ["React", "TypeScript", "UI/UX", "JavaScript", "CSS"],
    experiencia: [
      {
        puesto: "Frontend Developer",
        empresa: "Tech Solutions MX",
        periodo: "2020 - Presente"
      },
      {
        puesto: "Junior Web Developer",
        empresa: "Digital Creators",
        periodo: "2018 - 2020"
      }
    ],
    educacion: [
      {
        titulo: "Ingeniería en Computación",
        institucion: "Universidad de Guadalajara",
        periodo: "2014 - 2018"
      }
    ],
    entrevistas: [
      {
        fecha: "15/06/2025",
        puntuacion: 92,
        feedback: "Excelente desempeño en preguntas técnicas y comunicación clara."
      }
    ]
  },
  // Puedes agregar más perfiles aquí
];

export default function IntegracionLaboral() {
  const [perfilSeleccionado, setPerfilSeleccionado] = React.useState(null);

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
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-3">
                  {perfil.nombre.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{perfil.nombre}</h2>
                  <p className="text-blue-400">{perfil.puesto}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{perfil.email}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{perfil.telefono}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-300 mb-2">Habilidades principales</h3>
                <div className="flex flex-wrap gap-2">
                  {perfil.habilidades.slice(0, 4).map((habilidad, index) => (
                    <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
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
              <div className="flex flex-wrap gap-4 text-gray-300">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{perfilSeleccionado.email}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{perfilSeleccionado.telefono}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{perfilSeleccionado.ubicacion}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Secciones del perfil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Experiencia Laboral */}
              <div className="bg-gray-700 rounded-lg p-5">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Experiencia Laboral
                </h3>
                <div className="space-y-4">
                  {perfilSeleccionado.experiencia.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-400 pl-4">
                      <h4 className="font-medium">{exp.puesto}</h4>
                      <p className="text-gray-400">{exp.empresa}</p>
                      <p className="text-sm text-gray-500">{exp.periodo}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Educación */}
              <div className="bg-gray-700 rounded-lg p-5">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Educación
                </h3>
                <div className="space-y-4">
                  {perfilSeleccionado.educacion.map((edu, index) => (
                    <div key={index} className="border-l-2 border-green-400 pl-4">
                      <h4 className="font-medium">{edu.titulo}</h4>
                      <p className="text-gray-400">{edu.institucion}</p>
                      <p className="text-sm text-gray-500">{edu.periodo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="space-y-6">
              {/* Habilidades */}
              <div className="bg-gray-700 rounded-lg p-5">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Habilidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {perfilSeleccionado.habilidades.map((habilidad, index) => (
                    <span key={index} className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                      {habilidad}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Entrevistas */}
              <div className="bg-gray-700 rounded-lg p-5">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Última Entrevista
                </h3>
                {perfilSeleccionado.entrevistas.map((entrevista, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Fecha:</span>
                      <span>{entrevista.fecha}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Puntuación:</span>
                      <span className="bg-blue-500 px-2 py-1 rounded text-sm">{entrevista.puntuacion}/100</span>
                    </div>
                    <div>
                      <p className="font-medium mt-2">Feedback:</p>
                      <p className="text-gray-400 text-sm">{entrevista.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Acciones */}
              <div className="flex flex-col space-y-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Descargar CV
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contactar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}