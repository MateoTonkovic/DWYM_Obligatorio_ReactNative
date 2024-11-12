import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchComments } from '../service/api';

const CommentList = () => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchComments();
                setComments(data);
            } catch (err) {
                setError('Error al cargar los comentarios');
            }
        };

        loadComments();
    }, []);

    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Comentarios</Text>
            <FlatList
                data={comments}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.comment}>{item.content}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    comment: {
        fontSize: 14,
        paddingVertical: 4,
    },
});

export default CommentList;
