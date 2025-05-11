// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SideBar from './components/SideBar';
import ChatInterface from './components/Chat';
import Recursos from './components/Recursos';
import IntegracionLaboral from './components/IntegracionLaboral';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black">
        <Header isOpen={isOpen} />
        <div className="flex flex-1">
          <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 transition-all duration-300 p-4 border-l border-gray-300 rounded-lg ${isOpen ? 'ml-64' : 'ml-20'}`}>
            <Routes>
              <Route path="/Recursos" element={<Recursos />} />
              {/* Si quieres que Chat vaya en una ruta aparte: */}
              <Route path="/Chat" element={<ChatInterface />} />
              {/* Ruta “catch-all” */}
              <Route path="/IntegracionLaboral" element={<IntegracionLaboral />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
