import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Text,
  SafeAreaView,
} from 'react-native';
import { postService } from '../../services/post.service';
import { useAuth } from '../../context/AuthContext';
import Post from '../../components/Post';

const HomeScreen = ( {navigation}) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFeed = async () => {
    try {
      const feedData = await postService.fetchFeed();
      setPosts(feedData); // Ahora feedData ya es el array de posts
    } catch (error) {
      console.error('Error fetching feed:', error);
      Alert.alert('Error', 'No se pudo cargar el feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLikePost = async (postId, shouldLike) => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para dar like');
      return false;
    }

    try {
      if (shouldLike) {
        await postService.likePost(postId);
      } else {
        await postService.removeLike(postId);
      }
      
      // Actualizar el estado local del post
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post._id === postId) {
            const newLikes = shouldLike 
              ? [...(post.likes || []), user._id]
              : (post.likes || []).filter(id => id !== user._id);
            return {
              ...post,
              likes: newLikes
            };
          }
          return post;
        })
      );
      
      return true;
    } catch (error) {
      if (error.message?.includes('Ya has dado like')) {
        return true;
      }
      console.error('Error toggling like:', error);
      return false;
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchFeed();
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BD61DE" />
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay publicaciones para mostrar</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <Post
            post={item}
            onLike={(shouldLike) => handleLikePost(item._id, shouldLike)}
            currentUserId={user?._id}
            nagitation={navigation}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#BD61DE']}
            tintColor="#BD61DE"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        onEndReachedThreshold={0.5}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  feedContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default HomeScreen;