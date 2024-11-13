import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Navbar = ({ onLogout, navigateToUpload }) => {
  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // Asegúrate de ajustar la ruta de la imagen
          style={styles.logo}
          alt="Fakestagram"
        />
        <Text style={styles.navbarTitle}>Fakestagram</Text>
      </View>
      <View style={styles.navbarIcons}>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToUpload}>
          <Icon name="plus-square" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  navbarTitle: {
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#333',
  },
  navbarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff5757',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Navbar;
