// screens/Other/UserProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileComponent from '../../components/ProfileComponent';

const UserProfileScreen = ({ route }) => {
    const { userId } = route.params;

    return (
        <View style={styles.container}>
            <ProfileComponent userId={userId} isCurrentUser={false} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default UserProfileScreen;
