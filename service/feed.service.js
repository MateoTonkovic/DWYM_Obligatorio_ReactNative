import axios from "./axios";

const fetchFeed = async () => {
  const response = await axios.get("/posts/feed", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response;
};

const sendPost = async (data) => {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("caption", data.caption);

  const response = await axios.post(`/posts/upload`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const likePost = async (postId) => {
  try {
    const response = await axios.post(
      `/posts/${postId}/like`,
      {},
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
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
