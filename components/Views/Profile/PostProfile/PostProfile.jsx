import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome'; // Ajusta según tus iconos en React Native

const PostProfile = ({ username, userImage, postImage, likes, postDescription }) => {
  const profileData = {
    username: 'NombreUsuario',
    photoLikes: 333,
    photoDescription: 'beautiful',
  };

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.headerPostProfile}>
        <TouchableOpacity style={styles.arrowBack} onPress={() => console.log('Go back')}>
          <Icons name="arrow-left" size={20} />
        </TouchableOpacity>
        <View style={styles.headerNamePostProfile}>
          <Text style={styles.usernameHeader}>{profileData.username}</Text>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.imageContainer}>
        <View style={styles.profileAvatarName}>
          <View style={styles.profileAvatar}>
            <Image
              style={styles.profileImage}
              source={{ uri: userImage || 'https://placehold.co/80' }}
            />
          </View>
          <Text style={styles.usernameHeader}>{profileData.username}</Text>
        </View>

        {/* Post Image */}
        <View style={styles.espacioFoto}>
          <Image
            style={styles.postProfileImage}
            source={{ uri: postImage || 'https://placehold.co/400' }}
          />
        </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity onPress={() => console.log('Liked')}>
            <Icons name="heart" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Comment')}>
            <Icons name="comment" size={24} />
          </TouchableOpacity>
        </View>

        {/* Likes and Description */}
        <Text style={styles.postLikes}>{profileData.photoLikes} likes</Text>
        <Text style={styles.postDescription}>{profileData.photoDescription}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  headerPostProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 8,
  },
  arrowBack: {
    padding: 8,
  },
  usernameHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  profileAvatarName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
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
  espacioFoto: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },
  postProfileImage: {
    width: '100%',
    height: 300,
  },
  postActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  postLikes: {
    marginTop: 8,
    fontSize: 14,
  },
  postDescription: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default PostProfile;
