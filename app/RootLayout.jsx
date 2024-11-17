import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
    const router = useRouter();

    useEffect(() => {
        // Verificar si el usuario está autenticado cuando la app se inicia en la ruta raíz
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.replace('/login'); // Redirige al login si no hay token
            } else {
                router.replace('/tabs/feed'); // Redirige al feed si el usuario está autenticado
            }
        };
        checkAuth();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
            <Stack.Screen name="register" options={{ title: 'Register', headerShown: false }} />
            <Stack.Screen name="tabs/feed" options={{ title: 'Feed', headerShown: false }} />
            <Stack.Screen name="tabs/profile/[id]" options={{ title: 'Profile', headerShown: false }} />
        </Stack>
    );
}
