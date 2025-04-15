import React, { useState } from 'react';
import { FaArrowAltCircleUp } from 'react-icons/fa';
import { sendMessageToOllama } from '../api/ia/ollama'; // Importa la función

const ChatInterface2 = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Agrega el mensaje del usuario al historial
    setChatHistory([...chatHistory, { text: input, sender: 'user' }]);

    // Envía el mensaje a Ollama y obtiene la respuesta
    const response = await sendMessageToOllama(input);

    // Agrega la respuesta de Ollama al historial
    setChatHistory((prev) => [...prev, { text: response, sender: 'bot' }]);

    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#222649] p-4 rounded-lg border border-gray-300">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {chatHistory.length === 0 && (
          <p className="text-4xl text-center text-white font-bold">Comienza la conversación...</p>
        )}
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === 'user' ? 'bg-blue-500 self-end' : 'bg-gray-700 self-start'
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

export default ChatInterface2;