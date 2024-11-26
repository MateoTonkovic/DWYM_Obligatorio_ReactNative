import axios from "axios";

const API_URL = 'http://192.168.1.36:3001/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});

// Mejorado el interceptor para manejar errores de manera más silenciosa
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo logueamos errores que no sean de autenticación (401) o errores esperados
    if (
      !error.response ||
      (error.response.status !== 401 && error.response.status !== 400)
    ) {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);
// Servicio para buscar usuarios
export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/user/search`, {
      params: { query }, // Envía el término de búsqueda como parámetro
    });
    return response.data;
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    throw new Error("No se pudo realizar la búsqueda");
  }
};
const loginUser = async (credentials) => {
  try {
    const response = await instance.post("/auth/login", credentials);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Credenciales incorrectas");
    }
    throw new Error("Error en el servidor. Por favor, intente más tarde.");
  }
};

const registerUser = async (data) => {
  try {
    const response = await instance.post("/auth/register", data);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message || "Error en el registro");
    }
    throw new Error("Error en el servidor. Por favor, intente más tarde.");
  }
};

export const authService = {
  loginUser,
  registerUser,
};
