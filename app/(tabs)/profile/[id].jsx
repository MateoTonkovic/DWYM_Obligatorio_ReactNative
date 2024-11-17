import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileService } from '../../../service/profile.service';
import PlaceholderImage from '../../../components/PlaceHolderImage';
import Bottombar from '../../../components/Bottombar';

const ProfileScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [profileData, setProfileData] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserProfile, setIsUserProfile] = useState(false);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                // Obtener el ID del usuario autenticado
                const loggedUserId = await AsyncStorage.getItem('_id');

                // Verificar si el perfil que estamos viendo es el del usuario autenticado
                setIsUserProfile(id === loggedUserId);

                // Obtener los datos del perfil desde el servicio
                const response = await profileService.fetchProfile(id);
                setPhotos(response.data.posts);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos del perfil:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getProfileData();
    }, [id]);

    const handleFollowUser = async () => {
        try {
            if (profileData.user.isFriend) {
                await profileService.unfollowUser(id);
                setProfileData((prevData) => ({
                    ...prevData,
                    user: {
                        ...prevData.user,
                        isFriend: false,
                        friends: prevData.user.friends.filter((friend) => friend._id !== id),
                    },
                }));
            } else {
                await profileService.followUser(id);
                setProfileData((prevData) => ({
                    ...prevData,
                    user: {
                        ...prevData.user,
                        isFriend: true,
                        friends: [...prevData.user.friends, { _id: id }],
                    },
                }));
            }
        } catch (error) {
            console.error('Error al seguir/dejar de seguir al usuario:', error);
        }
    };

    const handleEditProfile = () => {
        router.push('/edit-profile');
    };

    const profileImageUrl = profileData?.user?.profilePicture
        ? profileData.user.profilePicture
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.user?.username.slice(0, 2) || 'U')}&background=random`;

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            {profileData ? (
                <View style={styles.profileContainer}>
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: profileImageUrl }} style={styles.profileAvatar} />
                        <View style={styles.profileStats}>
                            <Text style={styles.statValue}>{photos.length}</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                            <Text style={styles.statValue}>{profileData?.user?.friends.length}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </View>
                    <Text style={styles.bioName}>{profileData?.user?.username}</Text>
                    <Text style={styles.bioDescription}>{profileData?.user?.description}</Text>
                    {isUserProfile ? (
                        <TouchableOpacity onPress={handleEditProfile} style={styles.editProfileButton}>
                            <Text style={styles.buttonText}>Editar perfil</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleFollowUser} style={styles.editProfileButton}>
                            <Text style={styles.buttonText}>{profileData.user.isFriend ? 'Siguiendo' : 'Seguir'}</Text>
                        </TouchableOpacity>
                    )}

                    <FlatList
                        data={photos}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.photoItem} onPress={() => router.push(`/post/${item._id}`)}>
                                <PlaceholderImage src={`http://localhost:3000/${item.imageUrl}`} alt={item.caption} />
                            </TouchableOpacity>
                        )}
                        numColumns={3}
                    />
                </View>
            ) : (
                <Text style={styles.loadingText}>Cargando...</Text>
            )}
            <Bottombar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileContainer: {
        padding: 16,
        alignItems: 'center',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    profileStats: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    statLabel: {
        fontSize: 14,
        color: '#737373',
    },
    bioName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
    bioDescription: {
        fontSize: 14,
        color: '#737373',
        textAlign: 'center',
        marginBottom: 16,
    },
    editProfileButton: {
        backgroundColor: '#0095f6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    photoItem: {
        width: '30%',
        margin: 5,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ProfileScreen;
