import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Views/Auth/Login/Login';
import Register from '../Views/Auth/Register/Register';
import Feed from '../Views/Feed/Feed';
import Profile from '../Views/Profile/FeedProfile/Profile';
import EditProfile from '../Views/EditProfile/EditProfile';
import PostProfile from '../Views/Profile/PostProfile/PostProfile';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Feed" component={Feed} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="PostProfile" component={PostProfile} />
        </Stack.Navigator>
    );
}

export default AppNavigator;
