import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { postService } from '../../services/post.service';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  // Solicitar permisos al montar el componente
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para continuar.');
          }
        }
      })();
    }, [])
  );

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para continuar.');
        return;
      }

      // Seleccionar imagen de la galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        console.log('Selección cancelada');
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara para continuar.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handlePost = async () => {
    if (!image) {
      Alert.alert('Error', 'Por favor selecciona una imagen');
      return;
    }

    setLoading(true);
    try {
      // Preparar la imagen
      const formData = new FormData();
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
        name: filename || `photo_${Date.now()}.jpg`,
        type,
      });

      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }

      await postService.sendPost(image, caption);
      setImage(null);
      setCaption('');
      navigation.navigate('Home');
      Alert.alert('Éxito', 'Post creado correctamente');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        'No se pudo crear el post. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Nueva Publicación</Text>
          </View>

          <View style={styles.imageWrapper}>
            <View style={styles.imageContainer}>
              {image ? (
                <>
                  <Image source={{ uri: image }} style={styles.selectedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <Feather name="x" size={24} color="white" />
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Feather name="image" size={50} color="#666" />
                  <Text style={styles.placeholderText}>Selecciona una imagen</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.galleryButton]}
              onPress={pickImage}
            >
              <Feather name="image" size={24} color="white" />
              <Text style={styles.buttonText}>Galería</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cameraButton]}
              onPress={takePhoto}
            >
              <Feather name="camera" size={24} color="white" />
              <Text style={styles.buttonText}>Cámara</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Escribe una descripción..."
            placeholderTextColor="#666"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={2200}
          />

          <TouchableOpacity
            style={[styles.postButton, (!image || loading) && styles.disabledButton]}
            onPress={handlePost}
            disabled={!image || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Feather name="send" size={20} color="white" style={styles.sendIcon} />
                <Text style={styles.postButtonText}>Publicar</Text>
              </>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  imageContainer: {
    aspectRatio: 1, 
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    width: '80%', 
    alignSelf: 'center', 
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  galleryButton: {
    backgroundColor: '#BD61DE',
  },
  cameraButton: {
    backgroundColor: '#BD61DE',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: '#BD61DE',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendIcon: {
    marginRight: 8,
  },
  imageWrapper: {
    justifyContent: 'center', 
    alignItems: 'center',    
    marginTop: 20,           
    marginBottom: 20,        
  },
});

export default CreatePostScreen;