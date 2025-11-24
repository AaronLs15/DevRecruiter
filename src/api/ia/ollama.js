import ollama from 'ollama/browser';

/**
 * Envía un mensaje al modelo de Ollama y obtiene una respuesta.
 * @param {string} prompt - El mensaje que se enviará a Ollama.
 * @returns {Promise<string>} - La respuesta generada por Ollama.
 */
export const sendMessageToOllama = async (prompt) => {
  try {
    const response = await ollama.chat({
      model: 'llama3.2', // Modelo especificado
      messages: [{ role: 'user', content: prompt }], // Mensaje del usuario
    });

    // Devuelve el contenido del mensaje generado por Ollama
    return response.message.content || 'No se recibió respuesta de Ollama.';
  } catch (error) {
    console.error('Error al interactuar con Ollama:', error.message);
    return 'Error al generar la respuesta.';
  }
};