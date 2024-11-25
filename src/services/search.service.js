import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.3:3001/api';

// Función para obtener el token de autenticación
const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

// Servicio para buscar usuarios
export const searchUsers = async (query) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/user/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error en la búsqueda:', error.message);
    throw new Error('No se pudo realizar la búsqueda');
  }
};
