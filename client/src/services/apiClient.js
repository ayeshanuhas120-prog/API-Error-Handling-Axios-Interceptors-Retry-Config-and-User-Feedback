import axios from "axios";

// A single, shared Axios instance. Base URL comes from client/.env.development.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the auth token to every outgoing request when available.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors while allowing query/component error handlers to run.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      window.location.href = "/login";
    } else if (status >= 500) {
      window.alert("The server is temporarily unavailable. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
