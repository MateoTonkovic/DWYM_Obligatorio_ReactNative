import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icons } from "../Icons/Icons";

const Sidebar = () => {
    const navigation = useNavigation();
    const [loggedUserId, setLoggedUserId] = useState(null);
    const [currentPath, setCurrentPath] = useState(null);

    useEffect(() => {
        const getUserId = async () => {
            const userId = await AsyncStorage.getItem("_id");
            setLoggedUserId(userId);
        };
        getUserId();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate("Login"); 
    };

    return (
        <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>fakestagram</Text>
            </View>
            <View style={styles.sidebarMenu}>
                <View style={styles.buttonsWrapper}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Feed")}
                        style={[
                            styles.button,
                            currentPath === "/feed" && styles.activeButton,
                        ]}
                    >
                        <Icons.Home /> <Text>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Profile", { id: loggedUserId })}
                        style={[
                            styles.button,
                            currentPath && currentPath.startsWith("/profile") && styles.activeButton,
                        ]}
                    >
                        <Icons.User /> <Text>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("SearchFriends")}
                        style={[
                            styles.button,
                            currentPath === "/search-friends" && styles.activeButton,
                        ]}
                    >
                        <Icons.Search /> <Text>Search</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Icons.Logout /> <Text>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        width: 200,
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#f9f9f9",
        borderRightWidth: 1,
        borderColor: "#dbdbdb",
        paddingTop: 20,
        zIndex: 1000,
    },
    sidebarHeader: {
        padding: 10,
        textAlign: "center",
    },
    sidebarTitle: {
        fontWeight: "800",
        fontSize: 20,
    },
    sidebarMenu: {
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        paddingBottom: 20,
    },
    buttonsWrapper: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        width: "100%",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 38,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    activeButton: {
        fontWeight: "bold",
        color: "#0095f6",
        backgroundColor: "#e6f3ff",
    },
    logoutButton: {
        marginTop: "auto",
    },
});

export default Sidebar;
