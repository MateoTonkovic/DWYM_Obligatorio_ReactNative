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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await authService.loginUser({ email, password });
      await login(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Error', 'Credenciales incorrectas, por favor intenta de nuevo.');
      } else {
        Alert.alert('Error', 'Error en el inicio de sesión: ' + error.message);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={120}
        style={styles.container}
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

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Create account{' '}
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
              >
                here
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
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
  formContainer: {
    marginTop: 40,
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
  loginButton: {
    backgroundColor: 'rgba(189, 97, 222, 1)',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '60%',
    alignSelf: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 13,
  },
  registerLink: {
    color: 'rgba(189, 97, 222, 1)',
    fontWeight: 'bold',
  },
});

export default Login;