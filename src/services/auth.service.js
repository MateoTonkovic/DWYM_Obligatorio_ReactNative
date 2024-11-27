import axios from "axios";
import { envs } from "../config/envs";

const instance = axios.create({
  baseURL: envs.apiUrl,
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
    const response = await axios.get(`${envs.apiUrl}/user/search`, {
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
    console.log(response);
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
