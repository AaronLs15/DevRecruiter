import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App.jsx';
import { refreshToken } from './api/chat.js';
import { setAccessToken } from './api/http.js';

async function bootstrap() {
  const token = await refreshToken(); // null si 401
  setAccessToken(token || null);
}

bootstrap().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AppWrapper />
    </StrictMode>
  );
});
