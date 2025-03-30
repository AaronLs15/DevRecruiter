import React, { useState } from 'react';
import { FaArrowAltCircleUp } from 'react-icons/fa';
import useUserData from '../Hooks/chat/useUserData';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { userData, loading, error } = useUserData(); // Usar el hook personalizado

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChatHistory([...chatHistory, { text: input, sender: 'user' }]);
    setInput('');
  };

  console.log("chat",chatHistory)

  return (
    <div className="flex flex-col h-full bg-[#222649] p-4 rounded-lg border border-gray-300">
      {/* Mostrar la imagen del usuario */}
      {loading && <p className="text-white">Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {userData && userData.length > 0 && (
        <div className="flex justify-center mb-4">
          <img
            src="../../src/assets/logo.jpg" // Accede directamente a userData[0].Image
            alt="Usuario"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {chatHistory.length === 0 && (
          <p className="text-4xl text-center text-white font-bold ">Comienza la conversación...</p>
        )}
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-blue-500 self-end'
                : 'bg-gray-700 self-start'
            }`}
          >
            <p className="text-white">{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 border border-white text-white font-bold rounded-l-lg focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 bg-blue-800 text-white border rounded-r-lg hover:bg-green-600"
        >
          <FaArrowAltCircleUp size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
