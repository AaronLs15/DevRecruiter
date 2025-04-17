import { useState, useEffect } from 'react';
import usePrimeraFasePreguntas from './useChatData';

const VALID_ROLES = ['fullstack', 'backend', 'frontend'];

export default function useInterviewChat() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [roleSelected, setRoleSelected] = useState(false);
  const [showPrimeraFase, setShowPrimeraFase] = useState(false);
  const [loading, setLoading] = useState(false);

  const { primeraFasePreguntas, loading: loadingPrimeraF, error: errorPrimeraF } = usePrimeraFasePreguntas();

  // Mensaje inicial del sistema
  useEffect(() => {
    setChatHistory([
      {
        text: '¿A qué tipo de puesto como desarrollador aspiras? Desarrollador FullStack, Backend o Frontend?',
        sender: 'system',
      },
    ]);
  }, []);

  // Mostrar preguntas de primera fase cuando corresponda
  useEffect(() => {
    if (showPrimeraFase && !loadingPrimeraF) {
      if (errorPrimeraF) {
        setChatHistory(prev => [...prev, { text: 'Error al cargar las preguntas. Intenta más tarde.', sender: 'bot' }]);
      } else {
        primeraFasePreguntas.forEach(({ pregunta }) => {
          setChatHistory(prev => [...prev, { text: pregunta, sender: 'bot' }]);
        });
      }
      setShowPrimeraFase(false);
    }
  }, [showPrimeraFase, loadingPrimeraF, primeraFasePreguntas, errorPrimeraF]);

  const sendUserMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setChatHistory(prev => [...prev, { text: trimmed, sender: 'user' }]);

    // Selección de rol y despliegue de preguntas de primera fase
    if (!roleSelected) {
      const roleKey = trimmed.toLowerCase();
      if (!VALID_ROLES.includes(roleKey)) {
        setChatHistory(prev => [...prev, { text: 'Por favor vuelve a intentarlo :)', sender: 'bot' }]);
        setLoading(false);
      } else {
        setRoleSelected(true);
        setChatHistory(prev => [
          ...prev,
          { text: 'Perfecto! primero empecemos con las preguntas que tengo guardadas para trabajar cómo responderás preguntas para darte a conocer.', sender: 'bot' },
        ]);
        setShowPrimeraFase(true);
        setLoading(false);
      }
      setInput('');
      return;
    }

    // Aquí puedes manejar la respuesta del usuario a las preguntas de primera fase
    setLoading(false);
    setInput('');
  };

  return {
    input,
    setInput,
    chatHistory,
    loading,
    sendUserMessage,
  };
}
