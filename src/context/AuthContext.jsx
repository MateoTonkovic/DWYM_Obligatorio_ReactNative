// context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // Estado para el usuario

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      console.log('Stored userData:', userData); // Debugging

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
      console.log('Login data received:', data); // Debugging
      
      const { token, ...userInfo } = data; // Separamos el token del resto de la información

      // Guardamos el token
      await AsyncStorage.setItem('token', token);
      
      // Guardamos la información del usuario
      await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
      
      // Actualizamos el estado
      setUser(userInfo);
      setIsAuthenticated(true);
      
      console.log('User set in context:', userInfo); // Debugging
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
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
        user, // Exponemos el usuario en el contexto
        login,
        logout,
        checkToken,
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