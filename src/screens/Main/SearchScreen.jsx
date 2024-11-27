import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { searchUsers, followUser } from "../../services/search.service";

const SearchScreen = () => {
  const [query, setQuery] = useState(""); // Guarda el texto de la búsqueda
  const [results, setResults] = useState([]); // Almacena los resultados
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Almacena errores
  const [followStatus, setFollowStatus] = useState(null); // Estado del seguimiento

  // Maneja la búsqueda de usuarios
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setFollowStatus(null);
    try {
      const users = await searchUsers(query);
      setResults(users);
    } catch (error) {
      setError("No se pudo realizar la búsqueda. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Maneja el seguimiento de un usuario
  const handleFollow = async (userId) => {
    try {
      const response = await followUser(userId);
      setFollowStatus(`¡Ahora sigues a ${response.message || "el usuario"}!`);
    } catch (error) {
      setFollowStatus("Error al intentar seguir al usuario.");
    }
  };

  // Renderiza cada elemento en la lista de resultados
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.username}>{item.username || "Sin nombre"}</Text>
      <Text style={styles.email}>{item.email || "Sin correo"}</Text>
      <Button
        title="Seguir"
        onPress={() => handleFollow(item._id)} // Llama a la función de seguir
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Amigos</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el nombre del usuario"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <Button title="Buscar" onPress={handleSearch} disabled={loading} />
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          {followStatus && <Text style={styles.status}>{followStatus}</Text>}
          <FlatList
            data={results}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  status: {
    color: "green",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default SearchScreen;
