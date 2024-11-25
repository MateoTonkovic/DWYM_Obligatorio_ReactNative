import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  RefreshControl
} from 'react-native';
import { userService } from '../services/user.service';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = width / 3 - 2;

const ProfileComponent = ({ userId, isCurrentUser = false, onLogout, navigation }) => {
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isUserFriend = useMemo(() => {
    if (!profileData?.user?.friends || !currentUser?._id) return false;
    return profileData.user.friends.some(friend => friend._id === currentUser._id);
  }, [profileData?.user?.friends, currentUser?._id]);

  const fetchProfileData = async () => {
    // No intentar obtener datos si no hay userId o si no hay usuario actual
    if (!userId || !currentUser) {
      setLoading(false);
      return;
    }

    try {
      const response = await userService.getUserProfile(userId);
      if (response) {
        setProfileData(response);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (!isCurrentUser) {
        Alert.alert('Error', 'No se pudo cargar el perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && currentUser) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [userId, currentUser]);

  const handleRefresh = async () => {
    if (!userId || !currentUser) return;
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  const handleFollowUser = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return;
    }

    try {
      if (isUserFriend) {
        await userService.unfollowUser(userId);
        setProfileData(prevData => ({
          ...prevData,
          user: {
            ...prevData.user,
            friends: prevData.user.friends.filter(
              friend => friend._id !== currentUser._id
            )
          }
        }));
      } else {
        await userService.followUser(userId);
        setProfileData(prevData => ({
          ...prevData,
          user: {
            ...prevData.user,
            friends: [...(prevData.user.friends || []), { _id: currentUser._id }]
          }
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la acción');
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const renderPhoto = ({ item }) => (
    <TouchableOpacity 
      style={styles.photoItem}
      onPress={() => navigation.navigate('PostDetail', { postId: item._id })}
    >
      <Image
        source={{ uri: `http://192.168.1.3:3000/${item.imageUrl}` }}
        style={styles.photoImage}
      />
    </TouchableOpacity>
  );

  if (!userId || !currentUser) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BD61DE" />
      </View>
    );
  }

  if (!profileData?.user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el usuario</Text>
      </View>
    );
  }

  const profileImageUrl = profileData.user.profilePicture || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.user.username.slice(0, 2))}&background=random`;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData.user.friends?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.username}>{profileData.user.username}</Text>
          {profileData.user.description && (
            <Text style={styles.description}>{profileData.user.description}</Text>
          )}
        </View>

        {isCurrentUser ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.followButton,
              isUserFriend && styles.followingButton
            ]}
            onPress={handleFollowUser}
          >
            <Text style={styles.buttonText}>
              {isUserFriend ? 'Siguiendo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.photosContainer}>
        <FlatList
          data={profileData.posts}
          renderItem={renderPhoto}
          keyExtractor={(item) => item._id}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  bioSection: {
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    gap: 10,
  },
  editButton: {
    backgroundColor: '#343434',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#BD61DE',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#343434',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  photosContainer: {
    padding: 1,
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    margin: 1,
  },
  photoImage: {
    width: '100%',
    height: '100%',
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