const fetch = require('node-fetch');

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3.2';

const interviewController = {
  /**
   * Obtiene 5 preguntas técnicas para el rol especificado
   * Ruta: GET /api/interview/technical-questions?role=frontend|backend|fullstack
   */
    getSegundaFase: async (req, res) => {
        const role = req.query.role;
        if (!role) {
        return res.status(400).json({ error: 'Falta el parámetro role' });
        }

        const prompt = `Dame 5 preguntas tecnicas para simular una entrevista a un desarrollador ${role}. solo dame las preguntas enumeradas y no me des una introduccion a tu respuesta`;

        try {
        const response = await fetch(`${OLLAMA_URL}/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: MODEL_NAME, prompt })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Ollama error: ${text}`);
        }

        const json = await response.json();
        
        const raw = json.choices?.[0]?.text || '';
        // Separa y limpia las preguntas
        const preguntas = raw
            .split(/\r?\n/)         // por líneas
            .filter(line => line.match(/^\d+\./)) // sólo líneas numeradas
            .map(line => line.replace(/^\d+\.?\s*/, '').trim());

        return res.json({ data: preguntas });
        } catch (error) {
        console.error('Error en getTechnicalQuestions:', error);
        return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = interviewController;