import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icons } from '../components/Icons';

const CreatePostButton = ({ onClick }) => {
  return (
    <TouchableOpacity style={styles.createPostButton} onPress={onClick}>
      <Icons.PlusSquare size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  createPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0095f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1000,
  },
});

export default CreatePostButton;
