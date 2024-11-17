import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { authService } from '../service/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    router.replace('/feed');
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error al verificar el token:", error);
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await authService.loginUser(values);

                if (response.status === 200 && response.data.token) {
                    await AsyncStorage.setItem("token", response.data.token);
                    console.log('Token saved:', response.data.token);
                    router.replace('/feed');
                } else {
                    alert('Error al iniciar sesión. Credenciales inválidas.');
                }
            } catch (error) {
                alert('Error al iniciar sesión');
            }
        },
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

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

export default LoginScreen;
