import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useField } from 'formik';

function FormikTextFieldWrapper({ name, ...other }) {
    const [field, meta] = useField(name);

    return (
        <View style={styles.container}>
            <TextInput
                value={field.value}
                onChangeText={field.onChange(name)}
                onBlur={field.onBlur(name)}
                style={styles.input}
                {...other}
            />
            {meta.touched && meta.error ? (
                <Text style={styles.errorText}>{meta.error}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 4,
    },
});

export default FormikTextFieldWrapper;
