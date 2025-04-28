import { useState, useEffect } from 'react';
import { sendMessageToOllama } from '../../api/ia/ollama';
import usePrimeraFasePreguntas from './useChatData';
import { createEntrevista } from '../../api/chat';
import useUserData from './useUserData';


const VALID_ROLES = ['fullstack', 'backend', 'frontend'];

export default function useInterviewChat() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [role, setRole] = useState('');
  const [roleSelected, setRoleSelected] = useState(false);
  const [showPrimeraFase, setShowPrimeraFase] = useState(false);
  const [showSegundaFase, setShowSegundaFase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [segundaFasePreguntas, setSegundaFasePreguntas] = useState([]);
  const [entrevistaId, setEntrevistaId] = useState(null);       // NUEVO

  const { userData } = useUserData();
  
  const [respuestasPrimeraF, setRespuestasPrimeraF] = useState([]);
  const [respuestasSegundaF, setRespuestasSegundaF] = useState([]);

  const { primeraFasePreguntas, loading: loadingPrimeraF, error: errorPrimeraF } = usePrimeraFasePreguntas();

  // Mensaje inicial
  useEffect(() => {
    setChatHistory([
      { text: '¿A qué tipo de puesto como desarrollador aspiras? Desarrollador FullStack, Backend o Frontend?', sender: 'system' }
    ]);
  }, []);

  // Mostrar preguntas de primera fase
  useEffect(() => {
    if (showPrimeraFase && !loadingPrimeraF) {
      if (errorPrimeraF) {
        setChatHistory(prev => [
          ...prev,
          { text: 'Error al cargar las preguntas de la primera fase. Intenta más tarde.', sender: 'bot' }
        ]);
      } else {
        primeraFasePreguntas.forEach(({ pregunta }) => {
          setChatHistory(prev => [...prev, { text: pregunta, sender: 'bot' }]);
        });
        setChatHistory(prev => [
          ...prev,
          { text: 'Por favor responde a cada pregunta enumerando tu respuesta con el número de la pregunta correspondiente. Si no sabes la respuesta, escribe "Número de pregunta. No tengo una respuesta en mente para esta pregunta".', sender: 'bot' }
        ]);
      }
      setShowPrimeraFase(false);
    }
  }, [showPrimeraFase, loadingPrimeraF, primeraFasePreguntas, errorPrimeraF]);

   // Este efecto se dispara cuando cambian las respuestas de primera fase
   useEffect(() => {
    // Si justo acaban de responder la primera pregunta (length pasa a 1)
    // y aún no hemos creado la entrevista (entrevistaId === null)
    if (respuestasPrimeraF.length === 1 && entrevistaId === null) {
      const crear = async () => {
        try {
          const idUser = userData[0].id;
          const sectorId = 1; // mapea según tu lógica real
          const tipo = role.toLowerCase();
          const idEnt = await createEntrevista({
            ID_Aspirante: idUser,
            ID_Sector: sectorId,
            Tipo_Entrevista: tipo
          });
          //console.log('Entrevista creada con ID:', idEnt);
          setEntrevistaId(idEnt);
        } catch (err) {
          console.error('Error creando entrevista:', err);
        }
      };
      crear();
    }
  }, [respuestasPrimeraF, entrevistaId, userData, role]);

  // Mostrar y almacenar preguntas de segunda fase obtenidas desde Ollama
  useEffect(() => {
    if (showSegundaFase) {
      const fetchSegundaFase = async () => {
        setLoading(true);
        try {
          const prompt = `Dame 5 preguntas técnicas para simular una entrevista a un desarrollador ${role}. solo dame las preguntas enumeradas y no me des una introduccion a tu respuesta`;
          const raw = await sendMessageToOllama(prompt);
          const lines = raw.split(/\r?\n/).filter(line => line.trim());
          const preguntas = lines.map(line => line.replace(/^\d+\.?\s*/, '').trim());

          setSegundaFasePreguntas(preguntas);
          preguntas.forEach(q => setChatHistory(prev => [...prev, { text: q, sender: 'bot' }]));
        } catch (err) {
          console.error('Error en segunda fase IA:', err);
          setChatHistory(prev => [...prev, { text: 'Error obteniendo preguntas técnicas. Intenta más tarde.', sender: 'bot' }]);
        } finally {
          setChatHistory(prev => [...prev, { text: 'Por favor responde las preguntas anteriores cuando estés listo.', sender: 'bot' }]);
          setLoading(false);
          setShowSegundaFase(false);
        }
      };
      fetchSegundaFase();
    }
  }, [showSegundaFase, role]);

  // Envía el mensaje del usuario y controla el flujo
  const sendUserMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Agregar mensaje del usuario al historial
    setChatHistory(prev => [...prev, { text: trimmed, sender: 'user' }]);

    // Guardar respuestas de primera fase
    if (roleSelected && !showSegundaFase && primeraFasePreguntas.length > 0 && respuestasPrimeraF.length < primeraFasePreguntas.length) {
      setRespuestasPrimeraF(prev => [...prev, trimmed]);
    }

    // Guardar respuestas de segunda fase
    if (showSegundaFase === false && roleSelected && segundaFasePreguntas.length > 0 && respuestasSegundaF.length < segundaFasePreguntas.length) {
      // Antes de terminar carga de segunda fase, las respuestas del usuario corresponden a segunda fase
      setRespuestasSegundaF(prev => [...prev, trimmed]);
    }

    setLoading(true);

    // Selección de rol
    if (!roleSelected) {
      const roleKey = trimmed.toLowerCase();
      if (!VALID_ROLES.includes(roleKey)) {
        setChatHistory(prev => [...prev, { text: 'Por favor vuelve a intentarlo :)', sender: 'bot' }]);
        setLoading(false);
      } else {
        setRole(trimmed);
        setRoleSelected(true);
        setChatHistory(prev => [...prev, { text: 'Perfecto! Primero empecemos con las preguntas que tengo guardadas para trabajar cómo responderás preguntas para darte a conocer.', sender: 'bot' }]);
        setShowPrimeraFase(true);
        setLoading(false);
      }
      setInput('');
      return;
    }

    // Después de primera fase, pasar a segunda fase
    if (roleSelected && !showPrimeraFase && !showSegundaFase && !loadingPrimeraF && respuestasPrimeraF.length >= primeraFasePreguntas.length) {
      setChatHistory(prev => [...prev, { text: 'Gracias por tus respuestas. Ahora pasemos a la segunda fase de preguntas técnicas.', sender: 'bot' }]);
      setShowSegundaFase(true);
      setInput('');
      setLoading(false);
      return;
    }

    // Flujo normal tras fases completadas
    setLoading(false);
    setInput('');
  };

  return {
    input,
    setInput,
    chatHistory,
    loading,
    primeraFasePreguntas,
    respuestasPrimeraF,
    segundaFasePreguntas,
    respuestasSegundaF,
    showSegundaFase,
    sendUserMessage,
  };
}
