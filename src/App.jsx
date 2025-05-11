// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import SideBar from './components/SideBar';
import ChatInterface from './components/Chat';
import Recursos from './components/Recursos';
import Login from './components/Login';

// Un wrapper para poder usar useLocation
function AppWrapper() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Detectamos la ruta actual
  const location = useLocation();
  // Solo mostrar el sidebar en /Chat
  const showSidebar = location.pathname === '/Chat';

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header isOpen={isOpen} showSidebar={showSidebar} onToggle={showSidebar ? toggleSidebar : undefined} />

      <div className="flex flex-1">
        {showSidebar && (
          <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        )}

        <main
          className={`flex-1 transition-all duration-300 p-4 border-l border-gray-300 rounded-lg 
            ${showSidebar 
              ? (isOpen ? 'ml-64' : 'ml-20') 
              : 'ml-0'}`}
        >
          <Routes>
            <Route path="/Recursos" element={<Recursos />} />
            <Route path="/Chat" element={<ChatInterface />} />
            <Route path="/Login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AppWrapper;
