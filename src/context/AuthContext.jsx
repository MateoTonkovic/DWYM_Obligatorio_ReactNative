// context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      console.log('Stored userData:', userData);
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data) => {
    try {
      console.log('Login data received:', data);

      const { token, ...userInfo } = data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userInfo));

      setUser(userInfo);
      setIsAuthenticated(true);

      console.log('User set in context:', userInfo);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const updateUserData = async (newUserData) => {
    try {
      console.log('Updating user data:', newUserData);

      // Mantener los datos existentes del usuario y combinarlos con los nuevos
      const updatedUser = {
        ...user, // Mantener datos existentes como _id y email
        ...newUserData // Sobrescribir con los nuevos datos
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('User data updated successfully:', updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true); // Opcional: mostrar loading mientras se procesa
      await AsyncStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkToken,
        updateUserData, // Exponemos la nueva función
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