import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async (token) => {
    const response = await authAxios.get(`/verproductos`);
    return response.data;
  };