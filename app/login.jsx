import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { authService } from '../service/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await authService.loginUser(values);
                if (response.status === 200 && response.data.token) {
                    // Almacenar el token de autenticación
                    await AsyncStorage.setItem('token', response.data.token);
                    // Redirigir al feed después del inicio de sesión exitoso
                    router.replace('/feed');
                } else {
                    Alert.alert('Error al iniciar sesión', 'Credenciales incorrectas');
                }
            } catch (error) {
                Alert.alert('Error al iniciar sesión', error.response?.data?.message || error.message);
            }
        },
    });

    return (
        <View style={styles.loginContainer}>
            <View style={styles.imgLogin}>
                <Image source={require('../assets/images/Logo.png')} style={{ width: 100, height: 100 }} />
                <Image source={require('../assets/images/fakestagram.png')} style={styles.fakestagramImg} />
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.labelLogin}>Email</Text>
                <TextInput
                    style={styles.loginInput}
                    keyboardType="email-address"
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                />
                <Text style={styles.labelLogin}>Password</Text>
                <TextInput
                    style={styles.loginInput}
                    secureTextEntry
                    onChangeText={formik.handleChange('password')}
                    value={formik.values.password}
                />
                <View style={styles.divButtonLogin}>
                    <TouchableOpacity style={styles.loginBtn} onPress={formik.handleSubmit}>
                        <Text style={{ color: 'white' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.registerH2}>
                Create account{' '}
                <Text style={styles.registerLink} onPress={() => router.push('/register')}>
                    here
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loginContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 40,
        maxWidth: 400,
        minHeight: 500,
        marginTop: 100,
        alignSelf: 'center',
        textAlign: 'center',
    },
    loginForm: {
        flexDirection: 'column',
        marginTop: 20,
    },
    loginInput: {
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'rgba(217, 217, 217, 1)',
        fontSize: 16,
    },
    loginBtn: {
        backgroundColor: 'rgba(189, 97, 222, 1)',
        width: '60%',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    labelLogin: {
        marginVertical: 3,
    },
    imgLogin: {
        alignItems: 'center',
    },
    fakestagramImg: {
        marginTop: 20,
    },
    divButtonLogin: {
        marginTop: 20,
        alignItems: 'center',
    },
    registerH2: {
        fontSize: 13,
        fontWeight: '300',
        marginTop: 20,
        textAlign: 'center',
    },
    registerLink: {
        fontWeight: 'bold',
        color: 'blue',
    },
});

export default LoginScreen;