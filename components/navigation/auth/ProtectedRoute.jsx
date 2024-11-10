import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const ProtectedRoute = ({ component: Component }) => {
    const navigation = useNavigation();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
            } else {
                navigation.navigate('Login');
            }
        };

        checkAuth();
    }, []);

    return isAuthenticated ? <Component /> : <View><Text>Loading...</Text></View>;
};

export default ProtectedRoute;
