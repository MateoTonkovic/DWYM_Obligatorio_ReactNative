import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthorizationHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return headers;
};

export const headersHelper = {
  getAuthorizationHeaders,
};
