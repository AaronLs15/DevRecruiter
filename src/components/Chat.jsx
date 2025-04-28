// src/components/ChatInterface2.jsx
import React from 'react';
import { FaArrowAltCircleUp, FaSpinner } from 'react-icons/fa';
import useInterviewChat from '../Hooks/chat/useChat';


export default function ChatInterface() {
  const { input, setInput, chatHistory, loading, sendUserMessage } = useInterviewChat();

  const handleSubmit = e => {
    e.preventDefault();
    sendUserMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-[#222649] p-4 rounded-lg border border-gray-300">
      {/* Contenedor de mensajes con scroll */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 space-y-2">
        {chatHistory.map((msg, idx) => {
          const base = 'max-w-[70%] p-3 rounded-lg whitespace-pre-wrap text-white text-lg';
          const variant =
            msg.sender === 'user'
              ? 'bg-blue-500 ml-auto'
              : msg.sender === 'system'
              ? 'bg-gray-600 italic text-base text-gray-200 self-start'
              : 'bg-gray-700 self-start';
          return (
            <div key={idx} className={`${base} ${variant}`}>  
              <p>{msg.text}</p>
            </div>
          );
        })}
      </div>

      {/* Formulario fijo abajo */}
      <form onSubmit={handleSubmit} className="flex">  
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
          className="flex-1 p-2 border border-white text-white font-bold rounded-l-lg focus:outline-none disabled:opacity-50 text-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-800 text-white border rounded-r-lg flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" size={24} /> : <FaArrowAltCircleUp size={24} />}
        </button>
      </form>
    </div>
  );
}

