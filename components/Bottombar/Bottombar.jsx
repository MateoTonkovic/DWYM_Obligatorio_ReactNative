import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icons } from "../Icons/Icons";

const Bottombar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loggedUserId, setLoggedUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await AsyncStorage.getItem("_id");
            setLoggedUserId(userId);
        };
        fetchUserId();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate("Login");
    };

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Feed")}
                style={[
                    styles.button,
                    route.name === "Feed" && styles.activeButton,
                ]}
            >
                <Icons.Home />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Profile", { id: loggedUserId })}
                style={[
                    styles.button,
                    route.name === "Profile" && styles.activeButton,
                ]}
            >
                <Icons.User />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("SearchFriends")}
                style={[
                    styles.button,
                    route.name === "SearchFriends" && styles.activeButton,
                ]}
            >
                <Icons.Search />
                <Text>Buscar amigos</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Icons.Logout />
                <Text>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#dbdbdb",
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        zIndex: 1000,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    activeButton: {
        color: "#0095f6",
    },
});

export default Bottombar;
