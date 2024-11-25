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
    // Detectar cuando el usuario toca fuera de los campos de entrada para ocultar el teclado
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // Asegurarse de que la vista no quede oculta por el teclado en iOS
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}  // Ajuste de la altura para iOS y Android
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"  // Asegura que el teclado se oculte si se toca fuera
          showsVerticalScrollIndicator={false}  // Deshabilitar la visualización del indicador de desplazamiento
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessible={true}  // Hacer accesible para lectores de pantalla
              accessibilityLabel="Logo de la aplicación"  // Descripción para lectores de pantalla
            />
            <Image
              source={require('../../../assets/fakestagram.png')}
              style={styles.fakestagramLogo}
              resizeMode="contain"
              accessible={true}  // Hacer accesible para lectores de pantalla
              accessibilityLabel="Fakestagram"  // Descripción para lectores de pantalla
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label} nativeID="emailLabel">
              Correo electrónico
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}  // Actualizar el estado del correo electrónico
              keyboardType="email-address"  // Configurar el teclado para dirección de correo electrónico
              autoCapitalize="none"  // No autocompletar la primera letra en mayúsculas
              autoComplete="email"  // Sugerir correos electrónicos previamente usados
              returnKeyType="next"  // Establecer la tecla para mover al siguiente campo
              onSubmitEditing={() => passwordInputRef.current?.focus()}  // Foco automático al siguiente campo (contraseña)
              accessible={true}  // Accesibilidad para lectores de pantalla
              accessibilityLabel="Campo de correo electrónico"  // Descripción para el campo
              accessibilityHint="Introduce tu correo electrónico para iniciar sesión"  // Sugerencia accesible
              accessibilityLabelledBy="emailLabel"  // Asociar la etiqueta con este campo
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
              onChangeText={setPassword}  // Actualizar el estado de la contraseña
              secureTextEntry  // Mostrar como texto oculto
              returnKeyType="done"  // Configurar el teclado para completar el formulario
              onSubmitEditing={handleLogin}  // Llamar a la función de inicio de sesión al presionar "done"
              accessible={true}  // Hacer accesible para lectores de pantalla
              accessibilityLabel="Campo de contraseña"  // Descripción para el campo
              accessibilityHint="Introduce tu contraseña para iniciar sesión"  // Sugerencia accesible
              accessibilityLabelledBy="passwordLabel"  // Asociar la etiqueta con este campo
              placeholder="Contraseña"
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}  // Llamar a la función de inicio de sesión al presionar
              accessible={true}  // Hacer accesible para lectores de pantalla
              accessibilityLabel="Botón de inicio de sesión"  // Descripción para el botón
              accessibilityHint="Toca para iniciar sesión con tus credenciales"  // Sugerencia accesible
              accessibilityRole="button"  // Indicar que es un botón
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{' '}
                <Text
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}  // Navegar a la pantalla de registro
                  accessible={true}  // Hacer accesible para lectores de pantalla
                  accessibilityRole="link"  // Indicar que es un enlace
                  accessibilityHint="Navega a la pantalla de registro"  // Sugerencia accesible para el enlace
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