import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://192.168.1.3:3000';

const Post = ({ post, onLike, onRefresh }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Función para formatear la URL de la imagen
  const formatImageUrl = useCallback((path) => {
    if (!path) return null;
    // Si la ruta es absoluta (http o https), usarla directamente
    if (path.startsWith('http')) return path;
    // Si la ruta comienza con 'uploads', formar la URL completa
    return `${API_URL}/${path.replace('\\', '/')}`;
  }, []);

  // Manejar likes
  const handleLike = async () => {
    try {
      const success = await onLike(post._id, !isLiked);
      if (success) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el like');
    }
  };

  // Tiempo transcurrido desde la publicación
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    
    if (interval > 1) return Math.floor(interval) + ' años';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' meses';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' días';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' horas';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutos';
    return Math.floor(seconds) + ' segundos';
  };

  return (
    <View style={styles.container}>
      {/* Header del post */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ 
              uri: formatImageUrl(post.user?.profilePicture) || 
                   `https://ui-avatars.com/api/?name=${post.user?.username?.charAt(0)}&background=random`
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.username}>{post.user?.username}</Text>
            <Text style={styles.timeAgo}>{getTimeAgo(post.createdAt)} atrás</Text>
          </View>
        </View>
      </View>

      {/* Imagen del post */}
      <Image
        source={{ uri: formatImageUrl(post.imageUrl) }}
        style={styles.postImage}
        resizeMode="cover"
      />

      {/* Acciones */}
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={handleLike}
          style={styles.actionButton}
          disabled={isLiked} // Deshabilitar si ya dio like
        >
          <Feather
            name={isLiked ? "heart" : "heart"}
            size={24}
            color={isLiked ? "#ff3b30" : "#000"}
            style={isLiked ? styles.likedHeart : null}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setShowComments(true)}
          style={[styles.actionButton, { marginLeft: 15 }]}
        >
          <Feather name="message-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Contador de likes */}
      <Text style={styles.likesCount}>
        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
      </Text>

      {/* Caption */}
      {post.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.username}>{post.user?.username}</Text>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>
      )}

      {/* Vista previa de comentarios */}
      {post.comments && post.comments.length > 0 && (
        <TouchableOpacity 
          style={styles.commentsPreview}
          onPress={() => setShowComments(true)}
        >
          <Text style={styles.commentsCount}>
            Ver los {post.comments.length} comentarios
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal de comentarios */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comentarios</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Lista de comentarios */}
            {post.comments?.map((comment) => (
              <View key={comment._id} style={styles.commentItem}>
                <Image
                  source={{ 
                    uri: formatImageUrl(comment.user?.profilePicture) || 
                         `https://ui-avatars.com/api/?name=${comment.user?.username?.charAt(0)}&background=random`
                  }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUsername}>{comment.user?.username}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTime}>{getTimeAgo(comment.createdAt)}</Text>
                </View>
              </View>
            ))}

            {/* Input para nuevo comentario */}
            <View style={styles.newCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Añade un comentario..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity style={styles.sendButton}>
                <Feather name="send" size={24} color="#BD61DE" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
  },
  postImage: {
    width: windowWidth - 20,
    height: windowWidth - 20,
    backgroundColor: '#f0f0f0',
  },
  actions: {
    flexDirection: 'row',
    padding: 10,
  },
  actionButton: {
    marginRight: 15,
  },
  likedHeart: {
    transform: [{ scale: 1.1 }],
  },
  likesCount: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  captionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  caption: {
    marginLeft: 5,
  },
  commentsPreview: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  commentsCount: {
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  newCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginTop: 'auto',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
});

export default Post;