// Post.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { feedService } from '../service/feed.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Icons } from '../components/Icons';

const Post = ({ image }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(image.likes.length || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(image.comments || []);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem('_id');
      setLiked(image.likes.includes(userId));
    };
    getUserId();
  }, []);

  const handleLike = async () => {
    if (liked) {
      try {
        const response = await feedService.removeLike(image._id);
        if (response.status === 200) {
          setLiked(false);
          setLikeCount(likeCount - 1);
        }
      } catch (error) {
        console.error('Error al quitar like:', error);
      }
    } else {
      try {
        const response = await feedService.likePost(image._id);
        if (response.status === 200) {
          setLiked(true);
          setLikeCount(likeCount + 1);
        }
      } catch (error) {
        console.error('Error al dar like:', error);
      }
    }
  };

  const handleCommentSubmit = () => {
    if (!commentText) return;

    const newComment = {
      id: Date.now(),
      username: 'UsuarioActual', // Puedes recuperar esto desde AsyncStorage si es necesario
      text: commentText,
    };
    setComments([...comments, newComment]);
    setCommentText('');
  };

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  return (
    <View style={styles.postContainer}>
      <TouchableOpacity
        style={styles.postHeader}
        onPress={() => router.push(`/(tabs)/profile/${image.user._id}`)}
      >
        <Image
          source={{
            uri: image.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(image.user?.username.slice(0, 2))}&background=random`,
          }}
          style={styles.authorAvatar}
        />
        <Text style={styles.authorName}>{image.user?.username || 'Usuario'}</Text>
      </TouchableOpacity>


      <View style={styles.postImageContainer}>
        <Image
          source={{ uri: `http://localhost:3000/${image?.imageUrl}` }}
          style={styles.postImage}
        />
      </View>

      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{image?.title}</Text>
        <Text style={styles.postCaption}>{image?.caption}</Text>
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity
          style={[styles.actionBtn, liked && styles.liked]}
          onPress={handleLike}
        >
          <Icons.Heart size={24} color={liked ? '#ed4956' : 'black'} />
          <Text>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleCommentInput}>
          <Icons.Comment size={24} color="black" />
          <Text>{comments.length}</Text>
        </TouchableOpacity>
      </View>

      {showCommentInput && (
        <View style={styles.commentInputSection}>
          <TextInput
            style={styles.commentInput}
            placeholder="Escribe un comentario"
            value={commentText}
            onChangeText={(text) => setCommentText(text)}
            onSubmitEditing={handleCommentSubmit}
          />
          <TouchableOpacity onPress={handleCommentSubmit}>
            <Text style={styles.submitCommentBtn}>Comentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {comments.map((com) => (
        <View key={com.id} style={styles.comment}>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>@{com.username}</Text> {com.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    borderColor: '#dbdbdb',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 30,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postImageContainer: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postContent: {
    paddingVertical: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postCaption: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  liked: {
    color: '#ed4956',
  },
  commentInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: '#dbdbdb',
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
  },
  submitCommentBtn: {
    color: '#3897f0',
    fontWeight: 'bold',
  },
  comment: {
    marginTop: 5,
  },
});

export default Post;
