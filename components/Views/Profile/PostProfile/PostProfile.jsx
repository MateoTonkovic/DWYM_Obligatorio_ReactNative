import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { feedService } from '../../../service/feed.service';
import Bottombar from '../../../Components/Bottombar/Bottombar';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import { Icons } from '../../../Components/Icons/Icons';
import Post from '../../../Components/Post/Post';

const PostProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostsFromFeed = async () => {
            try {
                const response = await feedService.fetchFeed();
                const posts = response.data;
                const post = posts.find((p) => p._id === id);

                if (post) {
                    setImage(post);
                } else {
                    setError('Post no encontrado.');
                }
            } catch (err) {
                setError('No se pudo cargar el feed.');
            } finally {
                setLoading(false);
            }
        };

        fetchPostsFromFeed();
    }, [id]);

    if (loading) return <ActivityIndicator size="large" color="#6200EE" />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Sidebar />
            <View style={styles.postContentContainer}>
                <View style={styles.divArrowBack}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowBack}>
                        <Icons.ArrowBack />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerNamePostProfile}>
                    <Text style={styles.authorName}>{image.author}</Text>
                </View>
                <Post image={image} />
            </View>
            <Bottombar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    postContentContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 20,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    divArrowBack: {
        alignSelf: 'flex-start',
    },
    headerNamePostProfile: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    authorName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    arrowBack: {
        padding: 5,
        transform: [{ scale: 1 }],
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default PostProfile;
