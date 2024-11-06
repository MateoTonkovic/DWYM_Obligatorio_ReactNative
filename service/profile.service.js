import { headersHelper } from "../helpers/headers.helper";
import axios from "./axios";

// Función para obtener el perfil del usuario
const fetchProfile = (id) => {
  const authorizationHeader = headersHelper.getAuthorizationHeaders();

  const response = axios.get(`/user/profile/${id}`, {
    headers: { ...authorizationHeader },
  });

  return response;
};

// Nueva función para actualizar el perfil
const updateProfile = (token, data) => {
  const authorizationHeader = headersHelper.getAuthorizationHeaders();

  return axios.put("/profile", data, {
    headers: { ...authorizationHeader },
  });
};

// Función para el método postProfile
const postProfile = async (formData, token) => {
  const authorizationHeader = headersHelper.getAuthorizationHeaders();

  return await axios.post("/api/profile", formData, {
    headers: {
      ...authorizationHeader,
      "Content-Type": "multipart/form-data",
    },
  });
};

const followUser = async (userId) => {
  const authorizationHeader = headersHelper.getAuthorizationHeaders();

  return await axios.post(`/user/add-friend/${userId}`, null, {
    headers: { ...authorizationHeader },
  });
};

const editProfile = async (data) => {
  const authorizationHeader = headersHelper.getAuthorizationHeaders();

  return await axios.put("/user/profile/edit", data, {
    headers: { ...authorizationHeader },
  });
};

export const profileService = {
  fetchProfile,
  updateProfile,
  postProfile,
  followUser,
  editProfile,
};
