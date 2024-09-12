import React, { createContext, useState, useEffect } from 'react';
import authAxios from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserData(token);
    }
  }, []);

  const getUserData = async (token) => {
    try {
      const response = await authAxios.get('/verusuario', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuth({ user: response.data, token });
      setError(null);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      logoutUser();
    }
  };

  const loginUser = async (correo_electronico, contrasenia) => {
    try {
      const response = await authAxios.post('/login', { correo_electronico, contrasenia });
      const { token } = response.data;

      localStorage.setItem('token', token);
      await getUserData(token);
      setError(null);
    } 
    catch (err) {
      if (err.response && err.response.status === 400) {
        throw new Error('Credenciales incorrectas');
      } else {
        throw new Error('Credenciales incorrectas');
      }
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  };

  const registerUser = async (data) => {
    try {
      const response = await authAxios.post('/usuario', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 201) {
        setAuth(response.data);  
        console.log('Usuario registrado con éxito');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('No se pudo registrar el usuario');
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, loginUser, logoutUser, registerUser, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};