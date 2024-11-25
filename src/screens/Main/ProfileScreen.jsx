// screens/Main/ProfileScreen.js
import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProfileComponent from '../../components/ProfileComponent';

const ProfileScreen = () => {
  const { user, isLoading, logout } = useAuth();

  console.log('Usuario en ProfileScreen:', user); // Para debugging

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BD61DE" />
      </View>
    );
  }

  if (!user || !user._id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileComponent userId={user._id} isCurrentUser={true} onLogout={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

// Asegúrate de que esto esté al final del archivo
export default ProfileScreen;