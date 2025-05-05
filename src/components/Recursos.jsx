// src/components/Recursos.jsx
import React from 'react';

// Objeto que contiene todos los recursos organizados
const recursos = {
  documentos: [
    {
      id: 1,
      nombre: "Guía de entrevistas técnicas.pdf",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      nombre: "Preguntas comunes de RRHH.docx",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ],
  links: [
    {
      id: 1,
      nombre: "Ejemplos de entrevistas técnicas",
      url: "https://ejemplo.com/entrevistas",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      id: 2,
      nombre: "Blog de preparación laboral",
      url: "https://blog.ejemplo.com/preparacion",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    }
  ]
};

export default function Recursos() {
  return (
    <div className="text-white p-6 bg-gray-900 rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Recursos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sección de Documentos */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2 text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold">Documentos</h2>
          </div>
          <div className="space-y-3">
            {recursos.documentos.map((doc) => (
              <div key={doc.id} className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                {doc.icono}
                <span>{doc.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Links */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2 text-green-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h2 className="text-xl font-semibold">Links útiles</h2>
          </div>
          <div className="space-y-3">
            {recursos.links.map((link) => (
              <a 
                key={link.id}
                href={link.url} 
                className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icono}
                <span>{link.nombre}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sección Vacía */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2 text-yellow-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold">Próximamente</h2>
          </div>
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-center">Sección en desarrollo</p>
          </div>
        </div>
      </div>
    </div>
  );
}