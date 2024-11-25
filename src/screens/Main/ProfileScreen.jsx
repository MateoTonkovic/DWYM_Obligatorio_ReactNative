// screens/Main/ProfileScreen.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProfileComponent from '../../components/ProfileComponent';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  if (!user) 
    return null;

  return (
    <View style={styles.container}>
      <ProfileComponent 
        userId={user?._id} 
        isCurrentUser={true} 
        onLogout={logout}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default ProfileScreen;