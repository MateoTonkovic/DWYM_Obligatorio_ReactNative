// screens/Other/UserProfileScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileComponent from '../../components/ProfileComponent';

const UserProfileScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    return (
        <View style={styles.container}>
            <ProfileComponent 
                userId={userId} 
                isCurrentUser={false} 
                navigation={navigation}
            />
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