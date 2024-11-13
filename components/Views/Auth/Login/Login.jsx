import react from 'react';
import {View, Text, TextInput, StyleSheet, Button,Alert,Image} from 'react-native';
import {authService} from '../../../../service/auth.service';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    
    const navigation = useNavigation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            try {
                const response = await authService.loginUser(values);
                await AsyncStorage.setItem("userName", response.data);

                Object.keys(response.data).forEach(async(key) => {
                   await AsyncStorage.setItem(key, response.data[key]);
                });
            
                navigation.navigate("Feed");
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        Alert.alert("Credenciales Incorrectas, por favor intenta de nuevo");
                    } else {
                            Alert.alert("Error en el inicio de sesion: " + error.message);
                }    
            }
        },
    });

    return (
        <View style={styles.loginContainer}>
            <View style={styles.imgLogin}>
                <Image source={require('../../../../assets/images/login.png')} style={styles.logo}/>
                <Image source={require('../../../../assets/images/fakestagram.png')} style={styles.fakestagramImg}/>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.labelLogin}>Email</Text>
                <TextInput
                    style={styles.loginInput}
                    onChangeText={formik.handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={formik.values.email}
                    placeholder="Email"
                    secureTextEntry
                />
                <Text style={styles.labelLogin}>Password</Text>
                <TextInput
                    style={styles.loginInput}
                    onChangeText={formik.handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={formik.values.password}
                    placeholder="Password"
                    secureTextEntry
                />
                <View style={styles.divButtonLogin}>
                    <Button title="Login" onPress={formik.handleSubmit} color="#bd61de" />
                </View>
            </View>
            <Text style={styles.registerText}>
                Create Account{""}
                <Text style={styles.registerLink}onPress={() => navigation.navigate("Register")}>
                    here
                </Text>
            </Text>
        </View>
        );
};



const styles = StyleSheet.create({
    loginContainer: {
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      padding: 40,
      maxWidth: 400,
      minHeight: 400,
      marginVertical: 50,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      alignItems: 'center',
    },
    logo: {
      width: 100,
      height: 100,
    },
    fakestagramImg: {
      marginTop: 20,
      width: 150,
      height: 50,
    },
    formContainer: {
      marginTop: 60,
      width: '100%',
    },
    labelLogin: {
      alignSelf: 'flex-start',
      marginBottom: 3,
    },
    loginInput: {
      padding: 10,
      marginBottom: 20,
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: 'rgba(217, 217, 217, 1)',
      fontSize: 16,
    },
    divButtonLogin: {
      backgroundColor: 'rgba(189, 97, 222, 1)',
      width: '60%',
      color: 'white',
      padding: 10,
      border: none,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 40,
      fontSize: 16,
    },
    registerText: {
      fontSize: 13,
      fontWeight: '300',
      marginTop: 20,
    },
    registerLink: {
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
  });
  
  export default Login;











