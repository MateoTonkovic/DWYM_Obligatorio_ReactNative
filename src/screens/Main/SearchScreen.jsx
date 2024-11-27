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
import { searchUsers } from "../../services/search.service";

const SearchScreen = () => {
  const [query, setQuery] = useState(""); // Guarda el texto de la búsqueda
  const [results, setResults] = useState([]); // Almacena los resultados
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Almacena errores

  // Maneja la búsqueda de usuarios
  const handleSearch = async () => {
    setLoading(true); // Activa el estado de carga
    setError(""); // Limpia errores previos
    try {
      const users = await searchUsers(query); // Llama al servicio de búsqueda
      setResults(users); // Actualiza los resultados
    } catch (error) {
      setError("No se pudo realizar la búsqueda. Intenta nuevamente.");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  // Renderiza cada elemento en la lista de resultados
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Amigos</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el nombre del usuario"
        value={query}
        onChangeText={(text) => setQuery(text)} // Actualiza el texto de búsqueda
      />
      <Button title="Buscar" onPress={handleSearch} disabled={loading} />
      {error && <Text style={styles.error}>{error}</Text>} {/* Muestra errores */}
      {loading ? (
        <Text>Cargando...</Text> // Muestra un indicador de carga
      ) : (
        <FlatList
          data={results} // Datos a renderizar
          keyExtractor={(item) => item._id} // Clave única para cada elemento
          renderItem={renderItem} // Renderiza cada elemento
        />
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
});

export default SearchScreen;
