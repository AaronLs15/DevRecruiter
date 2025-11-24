import axios from 'axios';

// ====== Config ======
const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

// Token en memoria (no en localStorage)
let _accessToken = null;
export const setAccessToken = (t) => { _accessToken = t || null; };
export const getAccessToken = () => _accessToken;

// Cliente principal (NO envía cookies por defecto)
export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: false,
});

// Cliente para /auth (refresh necesita cookie httpOnly)
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // importante para /auth/refresh
});

// ====== Interceptor para adjuntar Authorization ======
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ====== Interceptor 401: refresh + retry (una vez) ======
let _isRefreshing = false;
let _pendingQueue = [];

const flushQueue = (error, token = null) => {
  _pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  _pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // No intentamos refresh si: no es 401, ya reintentado, o es el endpoint de refresh
    if (
      error?.response?.status !== 401 ||
      original?._retry ||
      original?.url?.includes('/auth/refresh')
    ) {
      throw error;
    }

    // Marca para evitar bucle
    original._retry = true;

    // Si ya hay un refresh en curso, encola y espera
    if (_isRefreshing) {
      try {
        const newToken = await new Promise((resolve, reject) => {
          _pendingQueue.push({ resolve, reject });
        });
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        throw e;
      }
    }

    _isRefreshing = true;
    try {
      const { data } = await authApi.post('/auth/refresh'); // usa cookie httpOnly
      const newToken = data?.accessToken;
      if (!newToken) throw new Error('No accessToken on refresh');

      setAccessToken(newToken);
      flushQueue(null, newToken);

      // reintenta la original con el nuevo token
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (e) {
      setAccessToken(null);
      flushQueue(e, null);
      throw e;
    } finally {
      _isRefreshing = false;
    }
  }
);
