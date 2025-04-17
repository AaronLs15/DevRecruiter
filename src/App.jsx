import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SideBar from './components/SideBar'
import ChatInterface from './components/Chat'

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header isOpen={isOpen} />
      <div className="flex flex-1">
        <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 transition-all duration-300 p-4 border-l border-gray-300 rounded-lg ${isOpen ? 'ml-64' : 'ml-20'}`}>
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}

export default App
