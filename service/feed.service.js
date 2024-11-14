import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchFeed = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await axios.get("/posts/feed", {
    headers: { authorization: `Bearer ${token}` },
  });
  return response;
};

const sendPost = async (data) => {
  const token = await AsyncStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("caption", data.caption);

  const response = await axios.post(`/posts/upload`, formData, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const likePost = async (postId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      `/posts/${postId}/like`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const feedService = {
  fetchFeed,
  sendPost,
  likePost,
};
