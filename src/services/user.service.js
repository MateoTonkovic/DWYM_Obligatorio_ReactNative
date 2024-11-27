// services/user.service.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.3:3001/api';

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

export const userService = {
    getUserProfile: async (userId) => {
        try {
            const headers = await getAuthHeader();
            const response = await axios.get(`${API_URL}/user/profile/${userId}`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error en getUserProfile:', error.response?.data || error.message);
            throw error;
        }
    },

    followUser: async (userId) => {
        try {
            const headers = await getAuthHeader();
            const response = await axios.post(`${API_URL}/user/add-friend/${userId}`, null, { headers });
            return response.data;
        } catch (error) {
            console.error('Error en followUser:', error.response?.data || error.message);
            throw error;
        }
    },

    unfollowUser: async (userId) => {
        try {
            const headers = await getAuthHeader();
            const response = await axios.delete(`${API_URL}/user/remove-friend/${userId}`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error en unfollowUser:', error.response?.data || error.message);
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const headers = await getAuthHeader();

            console.log('Sending update request with data:', userData);

            const response = await axios.put(`${API_URL}/user/profile/edit`, {
                username: userData.username,
                description: userData.description || '',
                profilePicture: userData.profilePicture || ''
            }, {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Update profile response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error en updateProfile:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                data: error.response?.config?.data
            });
            throw error;
        }
    }
};