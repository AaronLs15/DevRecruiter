// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getUserByID } from '../api/chat';

export const AuthContext = createContext({
  user: null,
  markAuthenticated: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Al montar, cargamos user si ya está en localStorage
  useEffect(() => {
    const id = localStorage.getItem('userID');
    if (!id) return;
    getUserByID(id)
      .then(({ data }) => data && setUser({
        id: data.ID,
        name: data.Nombre_usuario,
        email: data.Email,
        role: data.Rol
      }))
      .catch(() => {
        localStorage.clear();
        setUser(null);
      });
  }, []);

  const markAuthenticated = () => {
    // tras login/registro exitoso debes asegurarte de haber escrito localStorage
    const id = localStorage.getItem('userID');
    if (!id) return;
    // recargas datos de usuario
    getUserByID(id)
      .then(({ data }) => data && setUser({
        id: data.ID,
        name: data.Nombre_usuario,
        email: data.Email,
        role: data.Rol
      }));
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, markAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
