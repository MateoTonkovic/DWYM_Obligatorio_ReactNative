const getAuthorizationHeaders = () => {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return headers;
};

export const headersHelper = {
  getAuthorizationHeaders,
};
