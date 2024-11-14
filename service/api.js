import axios from 'axios';


const BASE_URL = 'http://192.168.8.255:3000/api'; // URL base de tu API

// Función para obtener los posteos
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/posts`);
    return response.data; // Retorna los datos de los posteos
  } catch (error) {
    console.error('Error al obtener los posteos:', error);
    throw error;
  }
};

// Función para obtener los comentarios
export const fetchComments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/comments`);
    return response.data; // Retorna los datos de los comentarios
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    throw error;
  }
};
