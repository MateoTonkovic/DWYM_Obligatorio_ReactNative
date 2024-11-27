import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { postService } from "../services/post.service";
import { envs } from "../config/envs";

const Post = ({ post, navigation }) => {
  const { user } = useAuth();
  const [isLiked, setisLiked] = useState(post.likes.includes(user._id));
  const [likeCount, setLikeCount] = useState(post.likes.length || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleUserPress = () => {
    navigation.navigate("UserProfile", { userId: post.user._id });
  };

  // Función para formatear la URL de la imagen
  const formatImageUrl = useCallback((path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${envs.apiUrl}/${path.replace("\\", "/")}`;
  }, []);

  // Manejar likes
  const handleLike = async () => {
    try {
      const success = await postService.likePost(post._id, !isLiked);
      if (success) {
        setisLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar el like");
    }
  };

  //Eliminar like
  const handleRemoveLike = async () => {
    try {
      const success = await postService.removeLike(post._id, !isLiked);
      if (success) {
        setisLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar el like");
    }
  };

  // Función para manejar el envío de un comentario
  const handleCommentSubmit = async () => {
    if (!commentText) return;

    try {
      const newComment = await postService.addComment(post._id, commentText);
      const newComments = [
        ...comments,
        {
          ...newComment,
          user: {
            _id: user._id, // Usa el usuario actual
            username: user.username, // Usa el username del usuario actual
          },
        },
      ];
      setComments(newComments);
      post.comments = newComments; // Actualiza directamente el objeto `post`
      setCommentText(""); // Limpia el campo de texto
    } catch (error) {
      console.error("Error al agregar comentario:", error.message);
      Alert.alert("Error", "No se pudo agregar el comentario");
    }
  };

  //Funcion para eliminar un comentario
  const handleDeleteComment = async (commentId) => {
    try {
      const success = await postService.removeComment(post._id, commentId);
      if (success) {
        const newComments = comments.filter((c) => c._id !== commentId);
        setComments(newComments);
        post.comments = newComments; // Actualiza directamente el objeto `post`
      }
    } catch (error) {
      console.error(
        "Error al eliminar comentario:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo eliminar el comentario"
      );
    }

    const toggleCommentInput = () => {
      setShowCommentInput(!showCommentInput);
    };
  };

  // Tiempo transcurrido desde la publicación
  const getTimeAgo = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "Fecha no disponible"; // Prevenir errores
    }
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return Math.floor(seconds) + " segundos";
  };

  return (
    <View style={styles.container}>
      {/* Header del post */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUserPress} style={styles.userInfo}>
          <Image
            source={{
              uri:
                formatImageUrl(post.user?.profilePicture) ||
                `https://ui-avatars.com/api/?name=${post.user?.username?.charAt(
                  0
                )}&background=random`,
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.username}>{post.user?.username}</Text>
            <Text style={styles.timeAgo}>
              {getTimeAgo(post.createdAt)} atrás
            </Text>
          </View>
        </TouchableOpacity>
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
          onPress={isLiked ? handleRemoveLike : handleLike} // Determina qué función llamar
          style={styles.actionButton}
        >
          <Feather
            name="heart"
            size={24}
            color={isLiked ? "#ff3b30" : "#000"} // Cambia el color según el estado de "like"
            style={isLiked ? styles.likedHeart : null}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowCommentInput(true)}
          style={[styles.actionButton, { marginLeft: 15 }]}
        >
          <Feather name="message-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Contador de likes */}
      <Text style={styles.likeCount}>
        {likeCount} {likeCount === 1 ? "like" : "likes"}
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
          onPress={() => setShowCommentInput(true)}
        >
          <Text style={styles.commentsCount}>
            Ver los {post.comments.length} comentarios
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showCommentInput}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentInput(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"} // Asegurarse de que la vista no quede oculta por el teclado en iOS
              keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0} // Ajuste de la altura para iOS y Android
              style={styles.avoidingView}
            >
              <View style={styles.modalContent}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Comentarios</Text>
                  <TouchableOpacity onPress={() => setShowCommentInput(false)}>
                    <Feather name="x" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                {/* Lista de comentarios */}
                <ScrollView contentContainerStyle={styles.commentsContainer}>
                  {comments.map((comment) => (
                    <TouchableOpacity
                      key={comment._id}
                      style={styles.commentItem}
                      onLongPress={() => {
                        Alert.alert(
                          "Eliminar comentario",
                          "¿Estás seguro de que quieres eliminar este comentario?",
                          [
                            { text: "Cancelar", style: "cancel" },
                            {
                              text: "Eliminar",
                              style: "destructive",
                              onPress: () => handleDeleteComment(comment._id), // Llama a la función para eliminar el comentario
                            },
                          ]
                        );
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            formatImageUrl(comment.user?.profilePicture) ||
                            `https://ui-avatars.com/api/?name=${comment.user?.username?.charAt(
                              0
                            )}&background=random`,
                        }}
                        style={styles.commentAvatar}
                      />
                      <View style={styles.commentContent}>
                        <Text style={styles.commentUsername}>
                          {comment.user?.username}
                        </Text>
                        <Text style={styles.commentText}>
                          {comment.content}
                        </Text>
                        <Text style={styles.commentTime}>
                          {getTimeAgo(comment.createdAt)}{" "}
                          {/*Funciona cuando recien se crea un comment, pero al recargar la pag se rompe}*/}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Input para nuevo comentario */}
                <View style={styles.newCommentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Añade un comentario..."
                    value={commentText}
                    onChangeText={setCommentText}
                  />
                  <TouchableOpacity
                    onPress={handleCommentSubmit}
                    style={styles.addCommentButton}
                  >
                    <Feather name="send" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timeAgo: {
    fontSize: 12,
    color: "#666",
  },
  postImage: {
    width: windowWidth - 20,
    height: windowWidth - 20,
    backgroundColor: "#f0f0f0",
  },
  actions: {
    flexDirection: "row",
    padding: 10,
  },
  actionButton: {
    marginRight: 15,
  },
  likedHeart: {
    transform: [{ scale: 1.1 }],
  },
  likesCount: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  captionContainer: {
    flexDirection: "row",
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
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "70%",
    padding: 20,
    justifyContent: "space-between",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentItem: {
    flexDirection: "row",
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
    fontWeight: "bold",
    marginBottom: 2,
  },
  commentText: {
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
  },
  newCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
