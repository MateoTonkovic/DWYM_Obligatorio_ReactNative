// screens/Other/EditProfileScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUserData } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    description: user?.description || '',
    profilePicture: user?.profilePicture || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.username.trim()) {
      Alert.alert('Error', 'El nombre de usuario es requerido');
      return;
    }

    try {
      setLoading(true);
      
      const updatedData = {
        username: form.username,
        description: form.description,
        profilePicture: form.profilePicture
      };

      const response = await userService.updateProfile(updatedData);
      await updateUserData(response.user);
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(text) => setForm(prev => ({ ...prev, username: text }))}
            placeholder="Tu nombre de usuario"
            autoCapitalize="none"
          />

          <Text style={styles.label}>URL de imagen de perfil</Text>
          <TextInput
            style={styles.input}
            value={form.profilePicture}
            onChangeText={(text) => setForm(prev => ({ ...prev, profilePicture: text }))}
            placeholder="https://ejemplo.com/tu-imagen.jpg"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
            placeholder="Cuéntanos sobre ti..."
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#BD61DE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;