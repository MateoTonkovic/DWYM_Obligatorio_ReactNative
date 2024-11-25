import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.3:3000/api/user';

// Configurar el interceptor para agregar el token
axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userService = {
  getUserProfile: async (userId) => {
    try {
      console.log('Haciendo petición a:', `${API_URL}/profile/${userId}`);
      const response = await axios.get(`${API_URL}/profile/${userId}`);
      console.log('Respuesta del perfil:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en getUserProfile:', error.response?.data || error.message);
      throw error;
    }
  }
};