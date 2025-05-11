import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaBriefcase, FaBook } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  // Definimos las secciones principales
  const secciones = [
    {
      id: 1,
      titulo: "Chat Bot",
      descripcion: "Habla con nuestro asistente virtual para practicar entrevistas y recibir retroalimentación personalizada.",
      icono: <FaRobot className="h-12 w-12 text-blue-500" />,
      color: "bg-blue-500",
      ruta: "/Chat"
    },
    {
      id: 2,
      titulo: "Integración Laboral",
      descripcion: "Explora perfiles profesionales y oportunidades de empleo adaptadas a tus habilidades.",
      icono: <FaBriefcase className="h-12 w-12 text-green-500" />,
      color: "bg-green-500",
      ruta: "/IntegracionLaboral"
    },
    {
      id: 3,
      titulo: "Recursos",
      descripcion: "Accede a documentos, enlaces y materiales para tu desarrollo profesional.",
      icono: <FaBook className="h-12 w-12 text-yellow-500" />,
      color: "bg-yellow-500",
      ruta: "/Recursos"
    }
  ];

  // Filtrar secciones según el estado de autenticación y rol
  let seccionesMostradas;
  if (!user) {
    // Sin sesión: todas las secciones, pero redirigen a Login
    seccionesMostradas = secciones;
  } else if (user.role === 'Aspirante') {
    // Aspirante: sólo Chat Bot y Recursos
    seccionesMostradas = secciones.filter(s => [1, 3].includes(s.id));
  } else if (user.role === 'Empleador') {
    // Empleador: todas las secciones
    seccionesMostradas = secciones;
  } else {
    // Por defecto, mostrar todas
    seccionesMostradas = secciones;
  }

  // Determinar ruta destino: Login si no hay usuario
  const getRuta = (rutaOriginal) => (!user ? '/Login' : rutaOriginal);

  return (
    <div className="text-white p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Banner de bienvenida */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 mb-10 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bienvenido a DevRecruiter</h1>
          <p className="text-xl text-gray-300">Preparándote para destacar en tu próxima entrevista laboral</p>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {seccionesMostradas.map((seccion) => (
            <Link
              key={seccion.id}
              to={getRuta(seccion.ruta)}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:transform hover:scale-105"
            >
              <div className={`${seccion.color} h-2`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {seccion.icono}
                  <h2 className="text-2xl font-bold ml-4">{seccion.titulo}</h2>
                </div>
                <p className="text-gray-300 mb-6">{seccion.descripcion}</p>
                <div className="flex justify-end">
                  <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center">
                    Ir a sección
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sección de estadísticas: sólo para Aspirantes autenticados */}
        {user && user.role === 'Aspirante' && (
          <div className="mt-12 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Tu Progreso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Entrevistas Completadas</div>
                <div className="text-3xl font-bold">{user.countEntrevista}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Recursos Consultados</div>
                <div className="text-3xl font-bold">0</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Días Activos</div>
                <div className="text-3xl font-bold">0</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}