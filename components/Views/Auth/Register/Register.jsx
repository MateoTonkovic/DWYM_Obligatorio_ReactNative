import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../../../service/auth.service';

const Register = () => {
  const navigation = useNavigation();

  const handleSubmit = async (data) => {
    try {
      const response = await authService.registerUser(data);
      if (response.status === 201) {
        // Limpiar AsyncStorage
        await AsyncStorage.clear();

        // Guardar datos en AsyncStorage
        const keys = Object.keys(response.data);
        for (const key of keys) {
          await AsyncStorage.setItem(key, response.data[key]);
        }

        navigation.navigate('Feed');
      } else {
        Alert.alert('Error al registrarse', response.data.message);
      }
    } catch (error) {
      console.error('Error al registrarse:', error.response || error);
      Alert.alert(
        'Error al registrarse',
        error.response?.data?.message || error.message
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.registerContainer}>
      <View style={styles.imgRegister}>
        <Image source={require('../../../../assets/images/Logo.png')} style={styles.logoImage} />
        <Image source={require('../../../../assets/images/fakestagram.png')} style={styles.fakestagramImage} />
      </View>

      {/* Botón de regreso */}
      <TouchableOpacity style={styles.backBtn} onPress={handleBackToLogin}>
        <Text style={styles.backBtnText}>← Volver</Text>
      </TouchableOpacity>

      <Formik
        initialValues={{
          email: '',
          username: '',
          password: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.registerForm}>
            <Text style={styles.labelRegister}>Nombre de usuario</Text>
            <TextInput
              style={styles.registerInput}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              placeholder="Nombre de usuario"
            />

            <Text style={styles.labelRegister}>Email</Text>
            <TextInput
              style={styles.registerInput}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="Email"
              keyboardType="email-address"
            />

            <Text style={styles.labelRegister}>Contraseña</Text>
            <TextInput
              style={styles.registerInput}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="Contraseña"
              secureTextEntry
            />

            <View style={styles.divButtonRegister}>
              <Button title="Registrarse" onPress={handleSubmit} color="#bd61de" />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 40,
    maxWidth: 400,
    minHeight: 400,
    margin: '10%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  registerForm: {
    width: '100%',
    marginTop: 20,
  },
  registerInput: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: 'rgba(217, 217, 217, 1)',
    fontSize: 16,
  },
  labelRegister: {
    marginVertical: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  divButtonRegister: {
    marginTop: 20,
  },
  imgRegister: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  fakestagramImage: {
    width: 150,
    height: 50,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backBtnText: {
    color: 'rgb(167, 49, 210)',
    fontSize: 16,
  },
});

export default Register;
