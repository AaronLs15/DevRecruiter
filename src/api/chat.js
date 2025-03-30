import axios from 'axios';

export const getUsersData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/Users'); // Cambia la URL si es necesario
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
};