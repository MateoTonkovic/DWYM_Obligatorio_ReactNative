import React, { useState } from 'react';
import { View, Text, TextInput,Button} from 'react-native';

const UploadPhoto = ({ onUpload }) => {
    const [image, setImage] = useState('');

    const handleUpload =  () => {
        onUpload(image);
        setImage('');
    };

    return (
        <View>
            <Text>Subir nueva imagen</Text>
            <TextInput
                value={image}
                onChangeText={setImage}
                placeholder="URL de la imagen"
            />
            <Button title="Subir imagen" onPress={handleUpload} />
        </View>
    );
}

export default UploadPhoto;