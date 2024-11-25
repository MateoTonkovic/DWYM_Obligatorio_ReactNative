import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { userService } from '../services/user.service';
import { useAuth } from '../context/AuthContext';

const ProfileComponent = ({ userId, isCurrentUser = false, onLogout }) => {
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isCurrentUser) {
          // Si es el usuario actual, usamos los datos del contexto
          console.log('Usando datos del contexto para usuario actual:', currentUser);
          setProfileUser(currentUser);
          setLoading(false);
        } else {
          // Si es otro usuario, hacemos la llamada a la API
          console.log('Fetching user profile for ID:', userId);
          const userData = await userService.getUserProfile(userId);
          setProfileUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, isCurrentUser, currentUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BD61DE" />
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.profileContainer}>
      <Image
        source={{ uri: profileUser.profilePicture || 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{profileUser.username}</Text>
      <Text style={styles.email}>{profileUser.email}</Text>

      {isCurrentUser ? (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.followButton]}
          onPress={() => Alert.alert('Info', 'Función de seguir en desarrollo')}
        >
          <Text style={styles.followText}>Seguir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BD61DE',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#BD61DE',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default ProfileComponent;