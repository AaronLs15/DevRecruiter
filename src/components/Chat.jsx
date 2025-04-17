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
    <div className="flex flex-col h-full bg-[#222649] p-4 rounded-lg border border-gray-300">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[70%] p-3 rounded-lg flex ${
              msg.sender === 'user'
                ? 'bg-blue-500 self-end'
                : msg.sender === 'system'
                ? 'bg-gray-600 self-start italic text-sm text-gray-200'
                : 'bg-gray-700 self-start'
            }`}
          >
            <p className="text-white whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
          className="flex-1 p-2 border border-white text-white font-bold rounded-l-lg focus:outline-none disabled:opacity-50"
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
