import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('token', userData.token);
      Object.keys(userData).forEach(async (key) => {
        await AsyncStorage.setItem(key, userData[key]);
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        login, 
        logout,
        checkToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};