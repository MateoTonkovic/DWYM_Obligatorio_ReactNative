import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const Post = ({ image }) => {
  const userId = localStorage.getItem('_id');
  const [liked, setLiked] = useState(image.likes.includes(userId));
  const [likeCount, setLikeCount] = useState(image.likes.length || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(image.comments || []);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const navigation = useNavigation();

  const handleLike = async () => {
    if (liked) {
      try {
        const response = await feedService.removeLike(image._id);
        if (response.status === 200) {
          setLiked(false);
          setLikeCount(likeCount - 1);
        } else {
          console.error('Error al remover like:', response);
        }
      } catch (error) {
        console.error('Error al remover like:', error);
      }
    } else {
      try {
        const response = await feedService.likePost(image._id);
        if (response.status === 200) {
          setLiked(true);
          setLikeCount(likeCount + 1);
        } else {
          console.error('Error al agregar like:', response);
        }
      } catch (error) {
        console.error('Error al agregar like:', error);
      }
    }
  };

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleCommentSubmit = () => {
    if (!commentText) return;

    const newComment = {
      id: Date.now(),
      username: localStorage.getItem('username') || 'usuario',
      text: commentText,
    };
    setComments([...comments, newComment]);
    setCommentText('');
  };

  const handleCommentEdit = (commentId) => {
    setComments(
      comments.map((com) =>
        com.id === commentId ? { ...com, text: editedComment } : com
      )
    );
    setEditCommentId(null);
  };

  const authorUsername = image.user?.username || 'User';
  const authorProfilePicture = image.user?.profilePicture;
  const profileImageUrl = authorProfilePicture
    ? authorProfilePicture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        authorUsername.slice(0, 2)
      )}&background=random`;

  return (
    <Animated.View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate('Profile', { userId: image.user._id })}
      >
        <Image
          source={{ uri: profileImageUrl }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{authorUsername}</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `http://localhost:3000/${image?.imageUrl}` }}
          style={styles.postImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{image?.title}</Text>
        <Text style={styles.caption}>{image?.caption}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Icon
            name="heart"
            size={24}
            color={liked ? '#ed4956' : '#262626'}
          />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={toggleCommentInput}
        >
          <Icon name="message-circle" size={24} color="#262626" />
          <Text style={styles.actionText}>{comments.length}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentsSection}>
        {comments.map((currentComment) => (
          <View key={currentComment._id} style={styles.comment}>
            <Text style={styles.commentUsername}>@{currentComment.username}</Text>
            {editCommentId === currentComment.id ? (
              <View style={styles.editCommentContainer}>
                <TextInput
                  style={styles.editCommentInput}
                  value={editedComment}
                  onChangeText={setEditedComment}
                  onSubmitEditing={() => handleCommentEdit(currentComment.id)}
                />
              </View>
            ) : (
              <View style={styles.commentContent}>
                <Text style={styles.commentText}>"{currentComment.text}"</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditCommentId(currentComment.id);
                    setEditedComment(currentComment.text);
                  }}
                >
                  <Icon name="edit-2" size={16} color="#262626" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {showCommentInput && (
          <View style={styles.commentInputSection}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment"
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={handleCommentSubmit}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCommentSubmit}
            >
              <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#262626',
  },
  imageContainer: {
    width: '100%',
    height: Dimensions.get('window').width,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 5,
  },
  caption: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#efefef',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#262626',
  },
  commentsSection: {
    padding: 15,
  },
  comment: {
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#262626',
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentText: {
    fontSize: 14,
    color: '#262626',
    flex: 1,
  },
  editCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editCommentInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 20,
    fontSize: 14,
    marginRight: 10,
  },
  commentInputSection: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 20,
    fontSize: 14,
    marginRight: 10,
  },
  submitButton: {
    padding: 8,
  },
  submitButtonText: {
    color: '#3897f0',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Post;