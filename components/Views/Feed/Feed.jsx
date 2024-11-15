import React, { useState, useEffect } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import {feedService} from '../../../service/feed.service';
import CreatePostModal from '../../CreatePostModal/CreatePostModal';
import CreatePostButton from '../../CreatePostButton/CreatePostButton';
import SideBar from '../../Sidebar/Sidebar';
import BottomBar from '../../Bottombar/Bottombar';
import Post from '../../Post/Post';



const Feed = () => {

    const [images, setImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreatePost = async(newPost) => {
        try {
            const response = await feedService.sendPost(newPost);
            setImages((prevImages) => [response.data, ...prevImages]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creando el post:', error);
            throw error;   
        }
    };

    useEffect(() => {
        const getFeed = async() => {
            const response = await feedService.fetchFeed();
            setImages(response.data);
        };
        getFeed();
    }, []);

    return (
        <View style={styles.feedContainer}>
            <SideBar />

            <Text style={styles.feedTitle}>Feed</Text>

            <View style={styles.feed}>
                {images.map((image) =>(
                    <Post key={image.id} image={image} />
                ))}
            </View>

            <CreatePostButton onPress={() => setIsModalOpen(true)} />
            
            <CreatePostModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreatePost}
              />

              <BottomBar />
        </View>
    );

};


const styles = StyleSheet.create({
    feedContainer: {
        flex: 1,
        marginTop: 80,  
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-start', 
    },
    feed: {
        flex: 1, 
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedTitle: {
        position: 'absolute', 
        top: 10, 
        left: 20,
        fontFamily: 'Arial Black', 
        fontWeight: '900',
        fontSize: 16, 
        color: 'black',
    },
});


export default Feed;