import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react';

export default function CreatePostButton({onPress}){
    
    return(
       <Pressable 
            style={({pressed}) => [
                styles.createPostButton,
                pressed && styles.createPostButtonPressed,
            ]}
            onPress={onPress}
            accesibilityLabel="Create Post"
        >
            <Plus size={24} color="white" />
       </Pressable>
    );
}

const styles = StyleSheet.create({
    
    createPostButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0095f6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },

    createPostButtonPressed: {
        backgroundColor: '0095f6',
        transform: [{ scale: 1.05 }],   
    },
})