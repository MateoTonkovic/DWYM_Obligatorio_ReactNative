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
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  AccessibilityInfo,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  
  // Referencias para los inputs
  const passwordInputRef = useRef(null);
  
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Campos requeridos', 
        'Por favor, completa todos los campos',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return;
    }

    try {
      const response = await authService.loginUser({ email, password });
      await login(response.data);
      // Feedback táctil/sonoro de éxito
      AccessibilityInfo.announceForAccessibility('Inicio de sesión exitoso');
    } catch (error) {
      const errorMessage = error.response?.status === 401
        ? 'Credenciales incorrectas, por favor intenta de nuevo.'
        : 'Error en el inicio de sesión: ' + error.message;
      
      Alert.alert('Error', errorMessage);
      // Feedback para lectores de pantalla
      AccessibilityInfo.announceForAccessibility(errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text style={styles.label} nativeID="emailLabel">
              Correo electrónico
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              accessible={true}
              accessibilityLabel="Campo de correo electrónico"
              accessibilityHint="Introduce tu correo electrónico para iniciar sesión"
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
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              accessible={true}
              accessibilityLabel="Campo de contraseña"
              accessibilityHint="Introduce tu contraseña para iniciar sesión"
              accessibilityLabelledBy="passwordLabel"
              placeholder="Contraseña"
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              accessible={true}
              accessibilityLabel="Botón de inicio de sesión"
              accessibilityHint="Toca para iniciar sesión con tus credenciales"
              accessibilityRole="button"
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{' '}
                <Text
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}
                  accessible={true}
                  accessibilityRole="link"
                  accessibilityHint="Navega a la pantalla de registro"
                >
                  Regístrate aquí
                </Text>
              </Text>
            </View>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
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
  formContainer: {
    width: '100%',
    marginBottom: 20,
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
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#333',
  },
  registerLink: {
    color: 'rgba(189, 97, 222, 1)',
    fontWeight: 'bold',
  },
});

export default Login;