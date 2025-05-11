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

export const getUserByID = async (ID) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/Users/${ID}`); // Cambia la URL si es necesario
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const actUsuario = async ({data}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/actUser',data);
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const actAspirante = async ({data}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/actAspirante',data);
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const actEmpleador = async ({data}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/actEmpleador',data);
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const iniciarSesion = async ({ data }) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/iniciarSesion',
      data
    );
    return response.data.data[0];
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const getPrimeraFasePreguntas= async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/PrimeraFasePreguntas'); // Cambia la URL si es necesario
    return response.data; // Devuelve los datos de las preguntas
  } catch (error) {
    console.error('Error al obtener las preguntas:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const getSegundaFasePreguntas = async (role) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/SegundaFasePreguntas?role=${encodeURIComponent(role)}`
    );
    return response.data; // Devuelve los datos de las preguntas
  } catch (error) {
    console.error('Error al obtener las preguntas:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const actPrimeraFase = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/actPrimeraFase');
    return response;
  } catch (error) {
    console.error('Error al obtener las preguntas de la primera fase:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const createEntrevista = async ({ ID_Aspirante, ID_Sector, Tipo_Entrevista }) => {
  try {
    const payload = {
      ID_Aspirante,
      ID_Sector,
      Tipo_Entrevista,
      Fecha_Entrevista: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      Estado: 'En Desarrollo'
    };
    const response = await axios.post('http://localhost:5000/api/Entrevista', payload);
    const { ID_Entrevista } = response.data;
    // Guardar en localStorage para uso posterior
    localStorage.setItem('ID_Entrevista', ID_Entrevista);
    return ID_Entrevista;
  } catch (error) {
    console.error('Error al crear la entrevista:', error);
    throw error;
  }
}

export const actCalificacionPrimeraFase = async ({data}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/actCalificacionPrimeraFase', data);
    return response.data; 
  } catch (error) {
    console.error('Error al actualizar la calificación de la primera fase:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const actCalificacionSegundaFase = async ({data}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/actCalificacionSegundaFase', data);
    return response.data; 
  } catch (error) {
    console.error('Error al actualizar la calificación de la segunda fase:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const actFeedbackEntrevista = async ({data}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/actFeedbackEntrevista', data);
    return response.data; 
  } catch (error) {
    console.error('Error al actualizar el feedback de la entrevista:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const actEntrevistaFinalizada = async ({data}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/actEntrevistaFinalizada', data);
    return response.data; 
  } catch (error) {
    console.error('Error al actualizar la entrevista finalizada:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}

export const getEntrevistaByUserID = async (ID) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/Entrevista/${ID}`); // Cambia la URL si es necesario
    return response.data; // Devuelve los datos de la entrevista
  } catch (error) {
    console.error('Error al obtener los datos de la entrevista:', error);
    throw error; // Lanza el error para manejarlo en el hook
  }
}
