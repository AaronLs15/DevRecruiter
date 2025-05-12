import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { getProfileByID,getPuntajesEntrevista } from '../api/chat';
import logo from '../assets/logo.jpg'

const Perfil = () => {
    const { user } = useContext(AuthContext); // { id, rol, token }
    const { id: userId, rol, token } = user;

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchData = async () => {
        try {
            // Usar helper para obtener perfil
            const dataProfile = await getProfileByID(userID, userRole);
            setProfile(dataProfile);

            // Obtener estadísticas de entrevistas
            const responseStats = await getPuntajesEntrevista(userID);
            const rawStats = Array.isArray(responseStats.data) ? responseStats.data : [];

            // Mapear a formato requerido por recharts
            const formattedStats = rawStats.map(item => ({
            date: new Date(item.Fecha_Entrevista).toLocaleDateString(),
            score: item.Puntaje_Total
            }));

            setStats(formattedStats);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [userId, rol, token]);

    if (loading) {
        return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="p-4 text-center text-red-600">
            <p>Ocurrió un error: {error}</p>
        </div>
        );
    }

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto text-white">
        {/* Contenedor principal: datos a la izquierda, logo a la derecha */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8">
            {/* Datos de usuario */}
            <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-2 text-blue-500">Perfil de {profile.Nombre_usuario}</h2>
            <p className="text-gray-300 mb-1"><strong>Email:</strong> {profile.Email}</p>
            {profile.Experiencia && <p className="text-gray-300 mb-1"><strong>Experiencia:</strong> {profile.Experiencia}</p>}
            {profile.Puesto_Aspirado && <p className="text-gray-300 mb-1"><strong>Puesto Aspirado:</strong> {profile.Puesto_Aspirado}</p>}
            {profile.Habilidades && <p className="text-gray-300 mb-1"><strong>Habilidades:</strong> {profile.Habilidades}</p>}
            {profile.Ubicacion && <p className="text-gray-300 mb-1"><strong>Ubicación:</strong> {profile.Ubicacion}</p>}
            {profile.Empresa && <p className="text-gray-300 mb-1"><strong>Empresa:</strong> {profile.Empresa}</p>}
            </div>
            {/* Imagen de logo a la derecha */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
            <img src={logo} alt="Logo" className="w-32 h-32 rounded-full object-cover" />
            </div>
        </div>

        {/* Estadísticas - sólo Aspirantes */}
        {userRole === 'Aspirante' && (
            <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-500">Estadísticas de Entrevistas</h3>
            <div className="bg-gray-700 rounded-lg p-4">
                <div className="w-full h-64">
                <ResponsiveContainer>
                    <LineChart data={stats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#E5E7EB' }} />
                    <YAxis domain={[0, 'auto']} tick={{ fill: '#E5E7EB' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} itemStyle={{ color: '#E5E7EB' }} formatter={value => [`${value}`, 'Puntuación']} />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Perfil;
