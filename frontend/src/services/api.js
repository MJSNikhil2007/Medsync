import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Inject bearer token into request headers if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("medivision_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept 401 unauthorized errors to clear session
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("medivision_token");
      // Optionally redirect or reload, but the AuthContext can handle it
    }
    return Promise.reject(error);
  }
);

export default API;
