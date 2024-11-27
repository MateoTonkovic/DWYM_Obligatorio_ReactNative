


const API_URL = 'http://192.168.1.3:3001/api';



import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { envs } from "../config/envs";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchFeed = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${envs.apiUrl}/posts/feed`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error en fetchFeed:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Error al obtener el feed"
    );
  }
};

const sendPost = async (imageUri, caption) => {
  try {
    const formData = new FormData();

    // Preparar la imagen para enviar
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("image", {
      uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
      name: filename || `photo_${Date.now()}.jpg`,
      type,
    });

    if (caption?.trim()) {
      formData.append("caption", caption.trim());
    }

    const headers = await getAuthHeader();
    // No establecer Content-Type, axios lo hará automáticamente con el boundary correcto

    const response = await axios.post(`${envs.apiUrl}/posts/upload`, formData, {
      headers: {
        ...headers,
        Accept: "application/json",
      },
      transformRequest: (data, headers) => {
        // No transformar los datos, dejar que axios maneje el FormData
        return data;
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error en sendPost:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al crear el post");
  }
};

// Dar me gusta a un post
const likePost = async (postId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${envs.apiUrl}/posts/${postId}/like`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("Ya has dado like")
    ) {
      return { message: "Already liked" };
    }
    throw new Error(
      error.response?.data?.message || "Error al dar like al post"
    );
  }
};

//Eliminar like
const removeLike = async (postId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.delete(`${envs.apiUrl}/posts/${postId}/like`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error en removeLike:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error al quitar el like del post"
    );
  }
};

// Agregar comentario a un post
const addComment = async (postId, content) => {
  try {
    const headers = await getAuthHeader(); // Asegúrate de que getAuthHeader esté implementado
    const response = await axios.post(
      `${envs.apiUrl}/posts/${postId}/comments`,
      { content },
      { headers }
    );
    console.log(response.data);
    return response.data; // Asume que la respuesta contiene el nuevo comentario
  } catch (error) {
    console.error(
      "Error al agregar comentario:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error al agregar comentario"
    );
  }
};

//Eliminar comentario de un post
const removeComment = async (postId, commentId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.delete(
      `${envs.apiUrl}/posts/${postId}/comments/${commentId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al eliminar comentario:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error al eliminar comentario"
    );
  }
};

export const postService = {
  fetchFeed,
  sendPost,
  addComment,
  likePost,
  removeLike,
  removeComment,
};
