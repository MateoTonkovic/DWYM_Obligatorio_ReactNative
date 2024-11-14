import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para obtener el token desde AsyncStorage
const getAuthorizationHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return { authorization: `Bearer ${token}` };
};

// Función para obtener el perfil del usuario
const fetchProfile = async (id) => {
  const authorizationHeader = await getAuthorizationHeaders();

  const response = await axios.get(`/user/profile/${id}`, {
    headers: { ...authorizationHeader },
  });

  return response;
};

// Función para actualizar el perfil
const updateProfile = async (data) => {
  const authorizationHeader = await getAuthorizationHeaders();

  return await axios.put("/profile", data, {
    headers: { ...authorizationHeader },
  });
};

// Función para publicar el perfil
const postProfile = async (formData) => {
  const authorizationHeader = await getAuthorizationHeaders();

  return await axios.post("/api/profile", formData, {
    headers: {
      ...authorizationHeader,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Función para seguir a un usuario
const followUser = async (userId) => {
  const authorizationHeader = await getAuthorizationHeaders();

  return await axios.post(`/user/add-friend/${userId}`, null, {
    headers: { ...authorizationHeader },
  });
};

// Función para editar el perfil
const editProfile = async (data) => {
  const authorizationHeader = await getAuthorizationHeaders();

  return await axios.put("/user/profile/edit", data, {
    headers: { ...authorizationHeader },
  });
};

// Exportar el servicio con todas las funciones
export const profileService = {
  fetchProfile,
  updateProfile,
  postProfile,
  followUser,
  editProfile,
};
