import React, { createContext, useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import authAxios from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [error, setError] = useState(null);
  //const navigate = useNavigate();

  // Recuperar el token desde el Local Storage al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si existe un token, obtener los datos del usuario
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
      // Puedes agregar lógica aquí para manejar tokens inválidos (e.g., borrar el token)
      logoutUser();
    }
  };

  const loginUser = async (correo_electronico, contrasenia) => {
    try {
      // Enviar las credenciales al backend
      const response = await authAxios.post('/login', { correo_electronico, contrasenia });
      const { token } = response.data;

      // Guardar el token en el Local Storage y en el estado
      localStorage.setItem('token', token);

      // Obtener inmediatamente los datos del usuario
      await getUserData(token);

      // Redirigir al usuario a la página de inicio
      //navigate('/home');
      setError(null);
    } 
    catch (err) {
      if (err.response && err.response.status === 400) {
        throw new Error('Credenciales incorrectas');
      } else {
        throw new Error('Credenciales incorrectas');
      }
      //console.error('Error al iniciar sesión:', err);
    }
  };

  const logoutUser = () => {
    // Limpiar token y datos del usuario
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
    //navigate('/login');
  };

  const registerUser = async (data) => {
    try {
      const response = await authAxios.post('/usuario', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 201) {
        setAuth(response.data);  // Guardar el usuario registrado en el estado de autenticación
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