import React from 'react';
import { useFormik } from 'formik';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { profileService } from '../../service/profile.service';

const EditProfile = () => {
    const navigation = useNavigation();

    const formik = useFormik({
        initialValues: {
            username: '',
            profilePicture: '',
        },
        onSubmit: async (values) => {
            try {
                await profileService.editProfile(values);
                navigation.navigate('Profile', { id: await AsyncStorage.getItem('_id') });
            } catch (error) {
                Alert.alert('Error en la edición de perfil', error.message);
            }
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Editar Perfil</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput
                    style={styles.input}
                    name="username"
                    onChangeText={formik.handleChange('username')}
                    value={formik.values.username}
                />
                <Text style={styles.label}>Foto de perfil</Text>
                <TextInput
                    style={styles.input}
                    name="profilePicture"
                    onChangeText={formik.handleChange('profilePicture')}
                    value={formik.values.profilePicture}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Editar" onPress={formik.handleSubmit} color="#6200EE" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 16,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default EditProfile;
