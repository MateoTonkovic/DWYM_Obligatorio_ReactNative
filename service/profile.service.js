import { headersHelper } from "../helpers/headers.helper";
import axios from "./axios";

// Función para obtener el perfil del usuario
const fetchProfile = async (id) => {
  const authorizationHeader = await headersHelper.getAuthorizationHeaders();

  const response = await axios.get(`/user/profile/${id}`, {
    headers: { ...authorizationHeader },
  });

  return response;
};

// Nueva función para actualizar el perfil
const updateProfile = async (data) => {
  const authorizationHeader = await headersHelper.getAuthorizationHeaders();

  return await axios.put("/profile", data, {
    headers: { ...authorizationHeader },
  });
};

// Función para el método postProfile
const postProfile = async (formData) => {
  const authorizationHeader = await headersHelper.getAuthorizationHeaders();

  return await axios.post("/api/profile", formData, {
    headers: {
      ...authorizationHeader,
      "Content-Type": "multipart/form-data",
    },
  });
};

const followUser = async (userId) => {
  try {
    const authorizationHeader = await headersHelper.getAuthorizationHeaders();

    return await axios.post(`/user/add-friend/${userId}`, null, {
      headers: { ...authorizationHeader },
    });
  } catch (error) {
    console.error(error);
  }
};

const unfollowUser = async (userId) => {
  try {
    const authorizationHeader = await headersHelper.getAuthorizationHeaders();

    return await axios.delete(`/user/remove-friend/${userId}`, {
      headers: { ...authorizationHeader },
    });
  } catch (error) {
    console.error(error);
  }
};

const editProfile = async (data) => {
  const authorizationHeader = await headersHelper.getAuthorizationHeaders();

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
  unfollowUser,
};
