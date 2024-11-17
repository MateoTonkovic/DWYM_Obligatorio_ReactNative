import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { authService } from '../service/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await authService.registerUser(values);
                if (response.status === 201) {
                    // Limpiar cualquier valor dentro de AsyncStorage
                    await AsyncStorage.clear();

                    // Guardar datos del usuario en AsyncStorage
                    Object.keys(response.data).forEach(async (key) => {
                        await AsyncStorage.setItem(key, response.data[key]);
                    });

                    Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.");
                    router.replace('/login'); // Redirigir al login después del registro exitoso
                } else {
                    Alert.alert("Error al registrarse", response.data.message);
                }
            } catch (error) {
                Alert.alert("Error al registrarse", error.response?.data?.message || error.message);
            }
        },
    });

    return (
        <View style={styles.registerContainer}>
            <View style={styles.imgRegister}>
                <Image source={require('../assets/images/Logo.png')} style={{ width: 100, height: 100 }} />
                <Image source={require('../assets/images/fakestagram.png')} style={styles.fakestagramImg} />
            </View>

            {/* Botón de regreso */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/login')}>
                <Text style={{ color: 'rgb(167, 49, 210)' }}>← Volver</Text>
            </TouchableOpacity>

            <View style={styles.registerForm}>
                <Text style={styles.labelRegister}>Nombre de usuario</Text>
                <TextInput
                    style={styles.registerInput}
                    onChangeText={formik.handleChange('username')}
                    value={formik.values.username}
                />
                <Text style={styles.labelRegister}>Email</Text>
                <TextInput
                    style={styles.registerInput}
                    keyboardType="email-address"
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                />
                <Text style={styles.labelRegister}>Contraseña</Text>
                <TextInput
                    style={styles.registerInput}
                    secureTextEntry
                    onChangeText={formik.handleChange('password')}
                    value={formik.values.password}
                />
                <View style={styles.divButtonRegister}>
                    <TouchableOpacity style={styles.registerBtn} onPress={formik.handleSubmit}>
                        <Text style={{ color: 'white' }}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    registerContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 40,
        maxWidth: 400,
        minHeight: 500,
        marginTop: 100,
        alignSelf: 'center',
        textAlign: 'center',
    },
    registerForm: {
        flexDirection: 'column',
        marginTop: 20,
    },
    registerInput: {
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'rgba(217, 217, 217, 1)',
        fontSize: 16,
    },
    registerBtn: {
        backgroundColor: 'rgba(189, 97, 222, 1)',
        width: '60%',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    labelRegister: {
        marginVertical: 3,
    },
    imgRegister: {
        alignItems: 'center',
    },
    fakestagramImg: {
        marginTop: 20,
    },
    divButtonRegister: {
        marginTop: 20,
        alignItems: 'center',
    },
    backBtn: {
        position: 'relative',
        marginTop: 20,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        alignSelf: 'flex-start',
    },
});

export default RegisterScreen;
