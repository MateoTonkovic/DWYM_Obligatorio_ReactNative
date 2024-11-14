import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Sidebar = ({ onLogout, navigateTo }) => {
  const currentPath = ''; // En React Native, la ruta actual se maneja de otra forma, podrías pasarla como prop

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>fakestagram</Text>
      </View>
      <View style={styles.sidebarMenu}>
        <TouchableOpacity
          onPress={() => navigateTo('Feed')}
          style={[styles.menuButton, currentPath === 'Feed' && styles.activeButton]}
        >
          <Icon name="home" size={24} color={currentPath === 'Feed' ? '#0095f6' : '#333'} />
          <Text style={[styles.menuText, currentPath === 'Feed' && styles.activeText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateTo('Notifications')}
          style={[styles.menuButton, currentPath === 'Notifications' && styles.activeButton]}
        >
          <Icon name="heart" size={24} color={currentPath === 'Notifications' ? '#0095f6' : '#333'} />
          <Text style={[styles.menuText, currentPath === 'Notifications' && styles.activeText]}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateTo('Create')}
          style={[styles.menuButton, currentPath === 'Create' && styles.activeButton]}
        >
          <Icon name="plus-square" size={24} color={currentPath === 'Create' ? '#0095f6' : '#333'} />
          <Text style={[styles.menuText, currentPath === 'Create' && styles.activeText]}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateTo('Profile')}
          style={[styles.menuButton, currentPath === 'Profile' && styles.activeButton]}
        >
          <Icon name="user" size={24} color={currentPath === 'Profile' ? '#0095f6' : '#333'} />
          <Text style={[styles.menuText, currentPath === 'Profile' && styles.activeText]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Icon name="sign-out" size={24} color="#ff5757" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
    borderRightWidth: 1,
    borderRightColor: '#dbdbdb',
    alignItems: 'center',
  },
  sidebarHeader: {
    padding: 10,
  },
  sidebarTitle: {
    fontWeight: '800',
    fontSize: 20,
  },
  sidebarMenu: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginTop: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#e6f3ff',
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#0095f6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff5757',
  },
});

export default Sidebar;
