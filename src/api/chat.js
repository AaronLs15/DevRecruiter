import { api, authApi, setAccessToken } from './http';

// ======= USERS =======
export const getUsersData = async () => {
  const { data } = await api.get('/Users');
  return data;
};

export const getUserByID = async (ID) => {
  const { data } = await api.get(`/Users/${ID}`);
  return data;
};

export const getUserDiasActivo = async (ID) => {
  const { data } = await api.get(`/Users/dias/${ID}`);
  return data;
};

export const actUsuario = async ({ data }) => {
  const res = await api.post('/actUser', data);
  return res.data;
};

export const actAspirante = async ({ data }) => {
  const res = await api.post('/actAspirante', data);
  return res.data;
};

export const actEmpleador = async ({ data }) => {
  const res = await api.post('/actEmpleador', data);
  return res.data;
};

// ======= AUTH =======
// reemplaza el endpoint legacy por el nuevo /auth/login
export const iniciarSesion = async ({ data }) => {
  const res = await authApi.post('/auth/login', {
    email: data.email,
    password: data.password,
    nombre: data.nombre,
    rol: data.rol,
  });
  const payload = res?.data || {};
  if (payload.accessToken) setAccessToken(payload.accessToken);
  return payload; // { user, accessToken }
};

// (si alguna vez quieres forzar refresh manual)
export const refreshToken = async () => {
  try {
    const res = await authApi.post('/auth/refresh'); // withCredentials: true
    const token = res?.data?.accessToken || null;
    if (token) setAccessToken(token);
    return token; // devuelve el accessToken o null
  } catch (err) {
    // Si no hay cookie o la sesión expiró, el backend devuelve 401: úsalo como "no hay sesión".
    if (err?.response?.status === 401) return null;
    // Otros errores sí deben propagarse (CORS, red, 5xx)
    throw err;
  }
};

export const logout = async () => {
  await authApi.post('/auth/logout'); // limpia cookie en el server
  setAccessToken(null);
};

// ======= ENTREVISTAS / PREGUNTAS =======
export const getPrimeraFasePreguntas = async () => {
  const { data } = await api.get('/PrimeraFasePreguntas');
  return data;
};

export const getSegundaFasePreguntas = async (role) => {
  const { data } = await api.get(`/SegundaFasePreguntas`, {
    params: { role },
  });
  return data;
};

export const actPrimeraFase = async () => {
  const res = await api.post('/actPrimeraFase');
  return res;
};

export const createEntrevista = async ({ ID_Aspirante, ID_Sector, Tipo_Entrevista }) => {
  const payload = {
    ID_Aspirante,
    ID_Sector,
    Tipo_Entrevista,
    Fecha_Entrevista: new Date().toISOString().split('T')[0],
    Estado: 'En Desarrollo',
  };
  const res = await api.post('/Entrevista', payload);
  const { ID_Entrevista } = res.data;
  localStorage.setItem('ID_Entrevista', ID_Entrevista);
  return ID_Entrevista;
};

export const actCalificacionPrimeraFase = async ({ data }) => {
  const res = await api.post('/actCalificacionPrimeraFase', data);
  return res.data;
};

export const actCalificacionSegundaFase = async ({ data }) => {
  const res = await api.post('/actCalificacionSegundaFase', data);
  return res.data;
};

export const actFeedbackEntrevista = async ({ data }) => {
  const res = await api.post('/actFeedbackEntrevista', data);
  return res.data;
};

export const actEntrevistaFinalizada = async ({ data }) => {
  const res = await api.post('/actEntrevistaFinalizada', data);
  return res.data;
};

export const getEntrevistaByUserID = async (ID) => {
  const { data } = await api.get(`/Entrevista/${ID}`);
  return data;
};

export const getProfileByID = async (ID, Rol) => {
  const { data } = await api.get(`/users/${ID}/profile`, {
    params: { Rol },
  });
  return data;
};

export const getPuntajesEntrevista = async (ID) => {
  const { data } = await api.get(`/users/${ID}/interviews`);
  return data;
};
