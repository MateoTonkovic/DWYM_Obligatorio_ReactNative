import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/auth.service';

const Register = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    try {
      const response = await authService.registerUser(formData);

      if (response.status === 201) {
        // Limpiar AsyncStorage antes de guardar nuevos datos
        await AsyncStorage.clear();

        // Guardar los datos del usuario
        Object.keys(response.data).forEach(async (key) => {
          await AsyncStorage.setItem(key, response.data[key]);
        });

        // Navegar a MainTabs en lugar de Feed
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Error', 'Error al registrarse: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
      Alert.alert(
        'Error',
        'Error al registrarse: ' +
        (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Image
              source={require('../../../assets/fakestagram.png')}
              style={styles.fakestagramLogo}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginTop: 120,

  },
  logo: {
    width: 100,
    height: 100,
  },
  fakestagramLogo: {
    width: 200,
    height: 50,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: 'rgb(167, 49, 210)',
    fontSize: 16,
  },
  formContainer: {
    marginTop: 60,
  },
  label: {
    marginBottom: 5,
    marginLeft: 3,
    color: '#333',
  },
  input: {
    backgroundColor: 'rgba(217, 217, 217, 1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: 'rgba(189, 97, 222, 1)',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '60%',
    alignSelf: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Register;