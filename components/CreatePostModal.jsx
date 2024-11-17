import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Icons } from '../components/Icons';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [newPost, setNewPost] = useState({
    image: null,
    caption: '',
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      setError('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setNewPost({ ...newPost, image: pickerResult.uri });
      setPreviewUrl(pickerResult.uri);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!newPost.image) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(newPost);
      setNewPost({ image: null, caption: '' });
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      setError('Error al crear el post. Por favor, intenta de nuevo.');
      console.error('Error detallado:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Post</Text>
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          <View style={styles.imageUploadContainer}>
            {previewUrl ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: previewUrl }} style={styles.image} />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={() => {
                    setPreviewUrl(null);
                    setNewPost({ ...newPost, image: null });
                  }}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadPlaceholder} onPress={handleImageChange}>
                <Icons.PlusSquare size={48} color="#0095f6" />
                <Text style={styles.uploadText}>Upload Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            value={newPost.caption}
            onChangeText={(text) => setNewPost({ ...newPost, caption: text })}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleSubmit}
              disabled={isLoading || !newPost.image}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.shareButtonText}>Share</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  imageUploadContainer: {
    borderWidth: 2,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 4,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 4,
  },
  changeImageText: {
    color: 'white',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#0095f6',
  },
  captionInput: {
    borderColor: '#dbdbdb',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#dbdbdb',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#0095f6',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CreatePostModal;
