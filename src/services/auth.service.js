import axios from 'axios';

const API_URL = 'http://192.168.1.3:3000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 5000
});

instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error);
    throw error;
  }
);

const loginUser = (credentials) => {
  return instance.post("/auth/login", credentials);
};

const registerUser = async (data) => {
  return instance.post("/auth/register", data);
};

export const authService = {
  loginUser,
  registerUser,
};