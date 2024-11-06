// auth.service.js
import axios from "./axios";

const loginUser = (credentials) => {
  return axios.post("/auth/login", credentials);
};

const registerUser = async (data) => {
  const response = await axios.post("/auth/register", data);
  return response;
};

export const authService = {
  loginUser,
  registerUser,
};
