import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, Button, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileService } from '../../../../service/profile.service';
import PlaceholderImage from '../../../PlaceHolderImage/PlaceHolderImage';

const Profile = () => {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [photos, setPhotos] = useState([]);

  const isUserProfile = async () => {
    const userId = await AsyncStorage.getItem('_id');
    return id === userId;
  };

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await profileService.fetchProfile(id);
        setPhotos(response.data.posts);
        setProfileData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProfileData();
  }, [id]);

  const handleRedirectProfile = (postId) => {
    navigation.navigate('Post', { postId });
  };

  const isUserFriend = useMemo(() => {
    const checkFriendStatus = async () => {
      const loggedUserId = await AsyncStorage.getItem('_id');
      return profileData?.user?.friends.some(
        (friend) => friend._id === loggedUserId
      );
    };
    checkFriendStatus();
  }, [profileData]);

  const handleFollowUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('_id');
      if (isUserFriend) {
        await profileService.unfollowUser(id);
        setProfileData((prevData) => ({
          ...prevData,
          user: {
            ...prevData.user,
            friends: prevData.user.friends.filter(
              (friend) => friend._id !== userId
            ),
          },
        }));
      } else {
        await profileService.followUser(id);
        setProfileData((prevData) => ({
          ...prevData,
          user: {
            ...prevData.user,
            friends: [
              ...prevData.user.friends,
              { _id: userId },
            ],
          },
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const authorUsername = profileData?.user?.username || 'Usuario';
  const authorProfilePicture = profileData?.user?.profilePicture;

  const profileImageUrl = authorProfilePicture
    ? authorProfilePicture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        authorUsername.slice(0, 2)
      )}&background=random`;

  return (
    <View style={styles.profile}>
      {profileData === null ? (
        <Text>Cargando...</Text>
      ) : (
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatar}>
                <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
              </View>

              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{photos.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profileData?.user?.friends.length}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileBio}>
              <Text style={styles.bioName}>{profileData.user.username}</Text>
              <Text style={styles.bioDescription}>{profileData.user.description}</Text>
            </View>

            {isUserProfile ? (
              <TouchableOpacity onPress={handleEditProfile} style={styles.editProfileButton}>
                <Text style={styles.editProfileButtonText}>Editar perfil</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleFollowUser} style={styles.editProfileButton}>
                <Text style={styles.editProfileButtonText}>{isUserFriend ? 'Siguiendo' : 'Seguir'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={photos}
            numColumns={3}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleRedirectProfile(item._id)} style={styles.photoItem}>
                <PlaceholderImage
                  src={`http://localhost:3000/${item.imageUrl}`}
                  alt={item.caption}
                  style={styles.photoImage}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '600',
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#737373',
  },
  profileBio: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bioName: {
    fontWeight: '600',
    fontSize: 18,
  },
  bioDescription: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
  },
  editProfileButton: {
    backgroundColor: '#343434',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  editProfileButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Profile;
