import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PlusSquare } from 'lucide-react-native';


const CreatePostModal = ({ isVisible, onClose, onSubmit }) => {
  const [newPost, setNewPost] = useState({
    image: null,
    caption: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImagePick = async () => {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setError('Se necesitan permisos para acceder a la galería');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setNewPost({ ...newPost, image: result.assets[0].uri });
        setError(null);
      }
    } catch (err) {
      setError('Error al seleccionar la imagen');
      console.error(err);
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
      // Limpiar el formulario
      setNewPost({ image: null, caption: '' });
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
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create New Post</Text>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.imageUploadContainer}>
            {newPost.image ? (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: newPost.image }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={() => setNewPost({ ...newPost, image: null })}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadPlaceholder}
                onPress={handleImagePick}
              >
                <PlusSquare color="#0095f6" size={48} />
                <Text style={styles.uploadText}>Upload Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            value={newPost.caption}
            onChangeText={(text) => setNewPost({ ...newPost, caption: text })}
            multiline
            numberOfLines={4}
            placeholderTextColor="#666"
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
              style={[
                styles.shareButton,
                (!newPost.image || isLoading) && styles.shareButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading || !newPost.image}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageUploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
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
  previewImage: {
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
    color: '#0095f6',
    marginTop: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#0095f6',
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  shareButtonDisabled: {
    backgroundColor: '#b2dffc',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CreatePostModal;