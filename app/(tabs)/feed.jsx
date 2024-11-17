import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { feedService } from '../../service/feed.service';
import Post from '../../components/Post';
import Bottombar from '../../components/Bottombar';
import CreatePostButton from '../../components/CreatePostButton';

const Feed = () => {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.replace('/login'); // Redirige al login si no hay token
            } else {
                fetchFeed(); // Si hay token, cargamos el feed
            }
        };
        checkAuth();
    }, []);

    const fetchFeed = async () => {
        try {
            const response = await feedService.fetchFeed();
            setImages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener el feed:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.feedContainer}>
            <FlatList
                data={images}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Post image={item} />}
            />
            <CreatePostButton />
            <Bottombar />
        </View>
    );
};

const styles = StyleSheet.create({
    feedContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Feed;
