import { useState, useEffect } from 'react';
import { getPrimeraFasePreguntas } from '../../api/chat';


const usePrimeraFasePreguntas = () => {
    const [primeraFasePreguntas, setPrimeraFasePreguntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrimeraFasePreguntas = async () => {
            try {
                const response = await getPrimeraFasePreguntas();
                if (response.data && response.data.length > 0) {
                    setPrimeraFasePreguntas(response.data);
                } else {
                    throw new Error('No se encontraron preguntas de la primera fase');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrimeraFasePreguntas();
    }, []);

    return { primeraFasePreguntas, loading, error };
}

export default usePrimeraFasePreguntas;
