import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const login = async (correo_electronico, contrasenia) => {
  const response = await authAxios.post('/login', { correo_electronico, contrasenia });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await authAxios.post('/usuario', userData);
  return response.data;
};

export const getUserData = async () => {
  const response = await authAxios.get('/verusuario');
  return response.data;
};

export default authAxios;