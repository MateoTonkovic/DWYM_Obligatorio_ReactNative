import React, { useState, useRef } from 'react';
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
  AccessibilityInfo,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

const Register = ({ navigation }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  // Referencias para la navegación entre inputs
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      Alert.alert(
        'Campos requeridos',
        'Por favor, completa todos los campos',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return false;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert(
        'Email inválido',
        'Por favor, ingresa un email válido',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return false;
    }

    // Validación básica de contraseña
    if (formData.password.length < 6) {
      Alert.alert(
        'Contraseña débil',
        'La contraseña debe tener al menos 6 caracteres',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // Primero registramos al usuario
      const registerResponse = await authService.registerUser(formData);
      
      // Si el registro es exitoso, intentamos hacer login automáticamente
      const loginResponse = await authService.loginUser({
        email: formData.email,
        password: formData.password
      });
      
      // Usar el contexto de autenticación para manejar el login
      await login(loginResponse.data);
      
      AccessibilityInfo.announceForAccessibility('Registro exitoso');
    } catch (error) {
      const errorMessage = error.response?.status === 400
        ? error.response.data.message || 'Error en el registro'
        : 'Error en el servidor. Por favor, intente más tarde.';

      Alert.alert('Error', errorMessage);
      AccessibilityInfo.announceForAccessibility(errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessible={true}
            accessibilityLabel="Botón volver"
            accessibilityHint="Volver a la pantalla anterior"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel="Logo de la aplicación"
            />
            <Image
              source={require('../../../assets/fakestagram.png')}
              style={styles.fakestagramLogo}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel="Fakestagram"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label} nativeID="usernameLabel">
              Nombre de usuario
            </Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
              blurOnSubmit={false}
              accessible={true}
              accessibilityLabel="Campo de nombre de usuario"
              accessibilityHint="Introduce tu nombre de usuario para el registro"
              accessibilityLabelledBy="usernameLabel"
              placeholder="Nombre de usuario"
              placeholderTextColor="#666"
            />

            <Text style={styles.label} nativeID="emailLabel">
              Email
            </Text>
            <TextInput
              ref={emailInputRef}
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              accessible={true}
              accessibilityLabel="Campo de email"
              accessibilityHint="Introduce tu email para el registro"
              accessibilityLabelledBy="emailLabel"
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#666"
            />

            <Text style={styles.label} nativeID="passwordLabel">
              Contraseña
            </Text>
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              accessible={true}
              accessibilityLabel="Campo de contraseña"
              accessibilityHint="Introduce tu contraseña para el registro"
              accessibilityLabelledBy="passwordLabel"
              placeholder="Contraseña (mínimo 6 caracteres)"
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              accessible={true}
              accessibilityLabel="Botón de registro"
              accessibilityHint="Toca para completar el registro"
              accessibilityRole="button"
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
    marginTop: Platform.OS === 'ios' ? 80 : 60,
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
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 1,
    padding: 10, // Área de toque más grande
  },
  backButtonText: {
    color: 'rgb(167, 49, 210)',
    fontSize: 18,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(217, 217, 217, 1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  registerButton: {
    backgroundColor: 'rgba(189, 97, 222, 1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Register;