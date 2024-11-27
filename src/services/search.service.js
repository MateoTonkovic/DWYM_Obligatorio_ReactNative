import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.3:3001/api';

// Función para obtener el token de autenticación
const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Token utilizado en la búsqueda:', token);
  return token;
};

// Servicio para buscar usuarios
export const searchUsers = async (query) => {
  try {
    const token = await getAuthToken();
    console.log('Query enviada:', query);

    const response = await axios.get(`${API_URL}/user/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { query },
    });

    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en la búsqueda:', error.response?.data || error.message);
    throw new Error('No se pudo realizar la búsqueda');
  }
};

// Servicio para seguir a un usuario
export const followUser = async (friendId) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(
      `${API_URL}/user/add-friend/${friendId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Usuario seguido:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al seguir al usuario:', error.response?.data || error.message);
    throw new Error('No se pudo seguir al usuario');
  }
};
