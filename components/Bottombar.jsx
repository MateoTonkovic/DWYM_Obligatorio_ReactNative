// src/components/Bottombar.jsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Icons } from './Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Bottombar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push('/login');
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => router.push('/feed')} style={styles.navButton}>
        <Icons.Home />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/profile')} style={styles.navButton}>
        <Icons.User />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/search-friends')} style={styles.navButton}>
        <Icons.Search />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.navButton}>
        <Icons.Logout />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1000,
  },
  navButton: {
    padding: 4,
  },
});

export default Bottombar;
