// src/components/ChatInterface2.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { FaArrowAltCircleUp, FaSpinner, FaRobot, FaUser, FaInfoCircle } from "react-icons/fa";
import useInterviewChat from "../Hooks/chat/useChat";

/**
 * ChatInterface2.jsx — UI mejorada para simulación de entrevista
 * - Burbujas modernas (usuario, sistema, asistente)
 * - Cabecera fija con estado y botón de scroll al final
 * - Indicador de "escribiendo" con animación
 * - Textarea con envío con Enter y salto de línea con Shift+Enter
 * - Autoscroll al nuevo mensaje
 * - Estados de bloqueo (loading / feedback enviado)
 */

export default function ChatInterface() {
  const { input, setInput, chatHistory, loading, sendUserMessage, isFeedbackSent } = useInterviewChat();

  const listRef = useRef(null);
  const endRef = useRef(null);
  const canSend = useMemo(() => !loading && !isFeedbackSent && input.trim().length > 0, [loading, isFeedbackSent, input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSend) sendUserMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) sendUserMessage();
    }
  };

  // Autoscroll al final cuando cambia el historial o el loading
  useEffect(() => {
    const el = endRef.current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory, loading]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1d2140] to-[#0f1330] p-4 md:p-6">
      {/* Header */}
      <header className="sticky top-0 z-10 -mx-2 md:mx-0 mb-3 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200">
            <FaRobot />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Simulación de Entrevista</div>
            <div className="text-xs text-white/60">Practica respuestas y recibe retroalimentación</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFeedbackSent ? (
            <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-200">Feedback enviado</span>
          ) : loading ? (
            <span className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 inline-flex items-center gap-2">
              <FaSpinner className="animate-spin" /> Generando respuesta…
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white/60">Listo</span>
          )}
          <button
            type="button"
            onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/15"
            aria-label="Bajar al final"
          >
            Ir al final
          </button>
        </div>
      </header>

      {/* Mensajes */}
      <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-1">
        {chatHistory.map((msg, idx) => (
          <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
        ))}

        {/* Indicador de typing */}
        {loading && (
          <div className="flex items-start gap-3 max-w-[72%]">
            <Avatar type="assistant" />
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white/80">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:120ms]" />
                <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Tips */}
      <aside className="mt-3 hidden md:flex items-start gap-2 text-white/60 text-sm">
        <FaInfoCircle className="mt-0.5" />
        <div>
          Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">Enter</kbd> para enviar, 
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">Shift</kbd>+<kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">Enter</kbd> para nueva línea.
        </div>
      </aside>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isFeedbackSent ? "La sesión ha finalizado." : "Escribe tu respuesta…"}
            disabled={loading || isFeedbackSent}
          />
          <button
            type="submit"
            disabled={!canSend}
            className={`shrink-0 rounded-2xl px-4 py-3 text-white inline-flex items-center justify-center border transition ${
              canSend
                ? "bg-blue-600 hover:bg-blue-700 border-blue-500"
                : "bg-white/10 border-white/20 opacity-50 cursor-not-allowed"
            }`}
            aria-label="Enviar"
            title="Enviar"
          >
            {loading ? <FaSpinner className="animate-spin" size={18} /> : <FaArrowAltCircleUp size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}

function Textarea(props) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px"; // hasta ~6-8 líneas
  }, [props.value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      className="flex-1 resize-none bg-transparent outline-none placeholder:text-white/40 text-white text-base md:text-lg px-2 py-2"
      {...props}
    />
  );
}

function Avatar({ type }) {
  if (type === "user") {
    return (
      <div className="h-8 w-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-200">
        <FaUser />
      </div>
    );
  }
  if (type === "system") {
    return (
      <div className="h-8 w-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-200">
        i
      </div>
    );
  }
  return (
    <div className="h-8 w-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-200">
      <FaRobot />
    </div>
  );
}

function MessageBubble({ sender, text }) {
  const isUser = sender === "user";
  const isSystem = sender === "system";
  const isAssistant = !isUser && !isSystem;

  const container = isUser ? "justify-end" : "justify-start";
  const bubbleBase =
    "max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed text-[15px] md:text-base";

  const bubbleStyle = isUser
    ? "bg-blue-600 text-white border border-blue-500/50"
    : isSystem
    ? "bg-white/5 text-white/80 italic border border-white/10"
    : "bg-white/5 text-white border border-white/10";

  return (
    <div className={`w-full flex ${container} gap-3`}>
      {!isUser && <Avatar type={isSystem ? "system" : "assistant"} />}
      <div className={`${bubbleBase} ${bubbleStyle}`}>{text}</div>
      {isUser && <Avatar type="user" />}
    </div>
  );
}
