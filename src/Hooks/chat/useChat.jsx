import { useState, useEffect } from 'react';
import { sendMessageToOllama } from '../../api/ia/ollama';
import { usePrimeraFasePreguntas } from './useChatData';
import { createEntrevista, actCalificacionPrimeraFase, actCalificacionSegundaFase, actFeedbackEntrevista,actEntrevistaFinalizada } from '../../api/chat';
import useUserData from './useUserData';

const VALID_ROLES = ['fullstack', 'backend', 'frontend'];
const PRIMERA_LIMIT = 1;
const SEGUNDA_LIMIT = 1;

export default function useInterviewChat() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [role, setRole] = useState('');
  const [roleSelected, setRoleSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Primera fase
  const { primeraFasePreguntas, loading: loadingPrimeraF, error: errorPrimeraF } = usePrimeraFasePreguntas();
  const [respuestasPrimeraF, setRespuestasPrimeraF] = useState([]);
  const [primeraIndex, setPrimeraIndex] = useState(-1);

  // Resultado IA primera fase
  const [calificacionPF, setCalificacionPF] = useState(null);

  // Calificación de experiencia antes de segunda fase
  const [expectRating, setExpectRating] = useState(false);
  const [experienciaRating, setExperienciaRating] = useState(null);

  // Segunda fase
  const [currentSegundaPregunta, setCurrentSegundaPregunta] = useState(null);
  const [respuestasSegundaF, setRespuestasSegundaF] = useState([]);
  const [scoresSegundaF, setScoresSegundaF] = useState([]);
  const [previousScore, setPreviousScore] = useState(30);

  const [entrevistaId, setEntrevistaId] = useState(null);
  const { userData } = useUserData();

  // feedback capturado y estado de bloqueo
  const [feedbackEntrevista, setFeedbackEntrevista] = useState(null);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);


  // Mensaje inicial
  useEffect(() => {
    setChatHistory([{ text: '¿A qué tipo de puesto como desarrollador aspiras? Desarrollador FullStack, Backend o Frontend?', sender: 'bot' }]);
  }, []);

  // Iniciar primera pregunta tras elegir rol
  useEffect(() => {
    if (roleSelected && !loadingPrimeraF && primeraFasePreguntas.length) {
      if (primeraIndex === -1) setPrimeraIndex(0);
    }
  }, [roleSelected, loadingPrimeraF, primeraFasePreguntas]);

  // Mostrar cada pregunta de la primera fase dinámicamente
  useEffect(() => {
    if (primeraIndex >= 0 && primeraIndex < PRIMERA_LIMIT) {
      const pregunta = primeraFasePreguntas[primeraIndex]?.pregunta;
      if (pregunta) setChatHistory(prev => [...prev, { text: `${primeraIndex + 1}. ${pregunta}`, sender: 'bot' }]);
    }
  }, [primeraIndex, primeraFasePreguntas]);

  // Crear entrevista tras la primera respuesta y almacenar ID
  useEffect(() => {
    if (respuestasPrimeraF.length === PRIMERA_LIMIT && entrevistaId === null) {
      (async () => {
        try {
          const idUser = localStorage.getItem('userID');
          const sectorId = 1;
          const tipo = role.toLowerCase();
          const idEnt = await createEntrevista({ ID_Aspirante: idUser, ID_Sector: sectorId, Tipo_Entrevista: tipo });
          setEntrevistaId(idEnt);
          localStorage.setItem('ID_Entrevista', idEnt);
        } catch (err) {
          console.error('Error creando entrevista:', err);
        }
      })();
    }
  }, [respuestasPrimeraF, entrevistaId, userData, role]);

  // Al terminar primera fase: calcular IA y guardar en base de datos
  useEffect(() => {
    if (respuestasPrimeraF.length === PRIMERA_LIMIT && entrevistaId) {
      (async () => {
        setLoading(true);
        const preguntasArr = primeraFasePreguntas.slice(0, PRIMERA_LIMIT).map(p => p.pregunta);
        const respuestasArr = respuestasPrimeraF;
        const prompt = `a partir de las siguientes preguntas ${preguntasArr.join(', ')} y sus respuestas ${respuestasArr.join(', ')} calificalas de 1 a 100 siendo 1 el valor minimo simulando una entrevista para un desarrollador ${role} solo retorname la calificacion que le das`;
        try {
          const raw = await sendMessageToOllama(prompt);
          const match = raw.match(/\d+/);
          const calif = match ? parseInt(match[0], 10) : 0;
          setCalificacionPF(calif);
          await actCalificacionPrimeraFase({ data: { Preguntas: preguntasArr.join(','), Respuestas: respuestasArr.join(','), ID_Entrevista: entrevistaId, Fase: 1, Calificacion: calif } });
        } catch (err) {
          console.error('Error en calificación primera fase:', err);
          setChatHistory(prev => [...prev, { text: 'Error al procesar la calificación de la primera fase. Intenta más tarde.', sender: 'bot' }]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [respuestasPrimeraF, entrevistaId]);

  // Cuando calificacionPF esté lista, mostrar resultado y pedir rating de experiencia
  useEffect(() => {
    if (calificacionPF !== null) {
      setChatHistory(prev => [
        ...prev,
        { text: `Calificación de la primera fase: ${calificacionPF}/100`, sender: 'bot' },
        { text: 'Para poder seguir con la etapa de las preguntas técnicas necesito saber lo siguiente para agregarlo a mi sistema.', sender: 'bot' },
        { text: 'En una escala del 1 al 5, ¿qué tan experimentado o con conocimiento te sientes en el área que elegiste para hacer la entrevista? (Responde únicamente con un número del 1 al 5)', sender: 'bot' }
      ]);
      setExpectRating(true);
      setLoading(false);
    }
  }, [calificacionPF]);

  // Finalizar segunda fase cuando los estados estén actualizados
  useEffect(() => {
    if (respuestasSegundaF.length === SEGUNDA_LIMIT && scoresSegundaF.length === SEGUNDA_LIMIT) {
      finalizarSegundaFase();
    }
  }, [respuestasSegundaF, scoresSegundaF]);

  // Manejar envío del usuario
  const sendUserMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setChatHistory(prev => [...prev, { text: trimmed, sender: 'user' }]);
    setInput('');

    // Selección de rol
    if (!roleSelected) {
      const key = trimmed.toLowerCase();
      if (!VALID_ROLES.includes(key)) {
        setChatHistory(prev => [...prev, { text: 'Rol no válido. Intenta FullStack, Backend o Frontend.', sender: 'bot' }]);
      } else {
        setRole(trimmed);
        setRoleSelected(true);
        setChatHistory(prev => [...prev, { text: '¡Genial! Empecemos con la primera fase de preguntas.', sender: 'bot' }]);
      }
      return;
    }

    // Guardar respuestas de primera fase
    if (respuestasPrimeraF.length < PRIMERA_LIMIT) {
      setRespuestasPrimeraF(prev => [...prev, trimmed]);
      setPrimeraIndex(prev => prev + 1);
      return;
    }

    // Validar y guardar calificación de experiencia
    if (expectRating) {
      const rating = parseInt(trimmed, 10);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        setChatHistory(prev => [...prev, { text: 'Por favor responde únicamente con un número del 1 al 5.', sender: 'bot' }]);
        return;
      }
      setExperienciaRating(rating);
      const score = Math.round((rating / 5) * 100);
      setPreviousScore(score);
      setChatHistory(prev => [...prev, { text: `Entendido, nivel ${rating} de experiencia (${score}/100). Comenzamos la fase técnica.`, sender: 'bot' }]);
      setExpectRating(false);
      fetchNextSegundaPregunta();
      return;
    }

    // Respuestas segunda fase
    if (currentSegundaPregunta && respuestasSegundaF.length < SEGUNDA_LIMIT) {
      // Guardar respuesta y puntaje
      const nuevaRespuesta = { pregunta: currentSegundaPregunta, respuesta: trimmed };
      setRespuestasSegundaF(prev => [...prev, nuevaRespuesta]);
      setLoading(true);
      try {
        const evalPrompt = `A partir de la pregunta: "${currentSegundaPregunta}" y esta respuesta: "${trimmed}", califícala en una escala de 1 a 100.`;
        const evalRaw = await sendMessageToOllama(evalPrompt);
        const match = evalRaw.match(/\d+/);
        const score = match ? parseInt(match[0], 10) : previousScore;
        setScoresSegundaF(prev => [...prev, score]);
        setPreviousScore(score);
        setChatHistory(prev => [...prev, { text: `Calificación de tu respuesta: ${score}/100`, sender: 'bot' }]);

        // Si no es la última, continuar
        const newCount = respuestasSegundaF.length + 1;
        if (newCount < SEGUNDA_LIMIT) {
          setChatHistory(prev => [...prev, { text: 'Aquí va otra pregunta técnica:', sender: 'bot' }]);
          fetchNextSegundaPregunta();
        }
      } catch (err) {
        console.error('Error evaluando tu respuesta:', err);
        setChatHistory(prev => [...prev, { text: 'Error evaluando tu respuesta. Continuemos.', sender: 'bot' }]);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para obtener la siguiente pregunta técnica
  const fetchNextSegundaPregunta = async () => {
    setLoading(true);
    try {
      const prompt = `Dame 1 pregunta técnica para simular una entrevista a un desarrollador ${role} con una dificultad de ${previousScore} sobre 100. Solo dame la pregunta enumerada.`;
      const raw = await sendMessageToOllama(prompt);
      const line = raw.split(/\r?\n/).find(l => l.trim());
      const pregunta = line.replace(/^\d+\.?\s*/, '').trim();
      setCurrentSegundaPregunta(pregunta);
      setChatHistory(prev => [...prev, { text: pregunta, sender: 'bot' }]);
    } catch (err) {
      console.error('Error obteniendo pregunta técnica:', err);
      setChatHistory(prev => [...prev, { text: 'Error obteniendo pregunta técnica. Intenta más tarde.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  // Finalizar segunda fase: mostrar todas preguntas, respuestas y promedio
  const finalizarSegundaFase = async () => {
    setChatHistory(prev => [...prev, { text: 'Has completado la fase técnica. ¡Gracias por tu participación! Aquí un resumen:', sender: 'bot' }]);

    const suma = scoresSegundaF.reduce((acc, val) => acc + val, 0);
    const promedio = scoresSegundaF.length ? Math.round(suma / scoresSegundaF.length) : 0;
    setChatHistory(prev => [...prev, { text: `Calificación promedio de la segunda fase: ${promedio}/100`, sender: 'bot' }]);

    if (entrevistaId) {
      try {
        const preguntas = respuestasSegundaF.map(r => r.pregunta).join(',');
        const respuestas = respuestasSegundaF.map(r => r.respuesta).join(',');
        await actCalificacionSegundaFase({ data: { Preguntas: preguntas, Respuestas: respuestas, ID_Entrevista: entrevistaId, Fase: 2, Calificacion: promedio } });
      } catch (err) {
        console.error('Error guardando calificación segunda fase:', err);
      }

      ReturnRetro();
      setChatHistory(prev => [...prev, { text: '¡Entrevista finalizada! Aquí tienes una retroalimentación:', sender: 'bot' }]);
    }

  };

  const ReturnRetro = () => {
    setLoading(true);
    const prompt = `A partir del siguiente chat que se ha dado entre un aspirante a desarrollador ${role} y un reclutador, dame una retroalimentación de lo que le falta al aspirante para mejorar su entrevista incluye links de informacion, paginas web o videos que pueda ver el aspirante para desarrollarse mejor, al igual la respuesta que me des estructurala como si estuvieras hablando directamente con el aspirante.
     El chat es el siguiente: ${chatHistory.map(m => `${m.sender}: ${m.text}`).join(' ')}`;

    sendMessageToOllama(prompt)
      .then(async raw => {
        const fullFeedback = raw.trim();

        // 1) guardarlo en estado y enviar al backend
        setFeedbackEntrevista(fullFeedback);
        await actFeedbackEntrevista({
          data: { ID_Entrevista: entrevistaId, Feedback: fullFeedback }
        });
        setIsFeedbackSent(true);

        // 2) añadir cada párrafo al chat para mostrarlo
        const nuevosMensajes = raw
          .trim()
          .split(/\n{2,}/)
          .map(parrafo => ({ text: parrafo.trim(), sender: 'bot' }));
        setChatHistory(prev => [...prev, ...nuevosMensajes]);

        // 3) **COMPILAR Y ENVIAR TODO EL CHAT** al endpoint de entrevista finalizada
        const historialCompleto = [
          // partimos de lo que ya había antes
          ...chatHistory,
          // luego los párrafos que acabamos de añadir
          ...nuevosMensajes
        ];
        const textoPlano = historialCompleto
          .map(msg => `${msg.sender}: ${msg.text}`)
          .join('\n');

        try {
          await actEntrevistaFinalizada({
            data: {
              ID_Entrevista: entrevistaId,
              EntrevistaText: textoPlano
            }
          });
        } catch (err) {
          console.error('Error al notificar entrevista finalizada:', err);
        }
      })
      .catch(err => {
        console.error('Error obteniendo retroalimentación:', err);
        setChatHistory(prev => [
          ...prev,
          { text: 'Error obteniendo retroalimentación. Intenta más tarde.', sender: 'bot' }
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
}

  return { input, setInput, chatHistory, loading, sendUserMessage, isFeedbackSent };
}
