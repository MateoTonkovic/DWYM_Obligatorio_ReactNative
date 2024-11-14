
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Bottombar = ({ toggleModal, handleGoToProfile }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentPath = route.name;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Feed')}
        style={[styles.button, currentPath === 'Feed' && styles.active]}
      >
        <Icon name="home" size={24} color={currentPath === 'Feed' ? 'blue' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={[styles.button, currentPath === 'Notifications' && styles.active]}
      >
        <Icon name="heart" size={24} color={currentPath === 'Notifications' ? 'blue' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleModal}
        style={[styles.button, currentPath === 'Create' && styles.active]}
      >
        <Icon name="plus-square" size={24} color={currentPath === 'Create' ? 'blue' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleGoToProfile}
        style={[styles.button, currentPath === 'Profile' && styles.active]}
      >
        <Icon name="user" size={24} color={currentPath === 'Profile' ? 'blue' : 'black'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    padding: 10,
  },
  active: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
});

export default Bottombar;
