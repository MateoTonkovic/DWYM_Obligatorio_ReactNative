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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const users = await searchUsers(query); // Llama al servicio de búsqueda
      setResults(users); // Actualiza los resultados
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
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
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id} // Asegúrate de que los documentos tengan un campo `_id`
          renderItem={renderItem}
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
  },
});

export default SearchScreen;
